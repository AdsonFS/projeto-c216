import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from '../entities/todo.entity';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { CategoryService } from './category.service';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    private readonly categoryService: CategoryService,
  ) { }

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const { categoryIds, dueDate, ...todoData } = createTodoDto;

    const todo = this.todoRepository.create(todoData);

    if (dueDate) {
      todo.dueDate = new Date(dueDate);
    }

    if (categoryIds && categoryIds.length > 0) {
      const categories = await this.categoryService.findByIds(categoryIds);
      todo.categories = categories;
    }

    return await this.todoRepository.save(todo);
  }

  async findAll(): Promise<Todo[]> {
    return await this.todoRepository.find({
      order: { created_at: 'DESC' },
      relations: ['categories']
    });
  }

  async findOne(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({
      where: { id },
      relations: ['categories']
    });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const { categoryIds, dueDate, ...todoData } = updateTodoDto;

    const todo = await this.findOne(id); // Ensure todo exists

    // Update basic todo data
    if (Object.keys(todoData).length > 0) {
      await this.todoRepository.update(id, todoData);
    }

    // Update due date if provided
    if (dueDate !== undefined) {
      todo.dueDate = dueDate ? new Date(dueDate) : undefined;
      await this.todoRepository.save(todo);
    }

    // Update categories if provided
    if (categoryIds !== undefined) {
      const categories = categoryIds.length > 0
        ? await this.categoryService.findByIds(categoryIds)
        : [];

      todo.categories = categories;
      await this.todoRepository.save(todo);
    }

    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const todo = await this.findOne(id); // Ensure todo exists
    await this.todoRepository.remove(todo);
  }

  async toggleComplete(id: number): Promise<Todo> {
    const todo = await this.findOne(id);
    todo.completed = !todo.completed;
    return await this.todoRepository.save(todo);
  }

  async getStats(): Promise<any> {
    const todos = await this.todoRepository.find({ relations: ['categories'] });
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    const overdue = todos.filter(todo =>
      !todo.completed && todo.dueDate && new Date(todo.dueDate) < now
    ).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Category distribution
    const categoryCount = new Map();
    todos.forEach(todo => {
      if (todo.categories && todo.categories.length > 0) {
        todo.categories.forEach(category => {
          const count = categoryCount.get(category.name) || 0;
          categoryCount.set(category.name, count + 1);
        });
      } else {
        const count = categoryCount.get('Sem categoria') || 0;
        categoryCount.set('Sem categoria', count + 1);
      }
    });

    const categoryDistribution = Array.from(categoryCount.entries()).map(([name, count]) => ({
      categoryName: name,
      count,
      color: name === 'Sem categoria' ? '#6c757d' : '#007bff'
    }));

    // Due date distribution
    const dueDateDistribution = {
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      future: 0,
      overdue: 0
    }; todos.filter(todo => !todo.completed && todo.dueDate).forEach(todo => {
      const dueDate = new Date(todo.dueDate!);

      if (dueDate < now) {
        dueDateDistribution.overdue++;
      } else if (dueDate <= today) {
        dueDateDistribution.today++;
      } else if (dueDate <= thisWeekEnd) {
        dueDateDistribution.thisWeek++;
      } else if (dueDate <= thisMonthEnd) {
        dueDateDistribution.thisMonth++;
      } else {
        dueDateDistribution.future++;
      }
    });

    return {
      total,
      completed,
      pending,
      overdue,
      completionRate,
      categoryDistribution,
      dueDateDistribution
    };
  }
}
