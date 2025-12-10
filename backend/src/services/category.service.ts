import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Check if category name already exists
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name }
    });

    if (existingCategory) {
      throw new ConflictException(`Category with name '${createCategoryDto.name}' already exists`);
    }

    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      order: { created_at: 'DESC' },
      relations: ['todos']
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['todos']
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    await this.findOne(id); // Ensure category exists

    // Check if new name conflicts with existing category
    if (updateCategoryDto.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name }
      });

      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException(`Category with name '${updateCategoryDto.name}' already exists`);
      }
    }

    await this.categoryRepository.update(id, updateCategoryDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id); // Ensure category exists
    await this.categoryRepository.remove(category);
  }

  async findByIds(ids: number[]): Promise<Category[]> {
    if (!ids || ids.length === 0) {
      return [];
    }

    return await this.categoryRepository.findByIds(ids);
  }

  async getCategoryStats(): Promise<{ totalCategories: number; categoriesWithTodos: number }> {
    const totalCategories = await this.categoryRepository.count();
    const categoriesWithTodos = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.todos', 'todo')
      .groupBy('category.id')
      .having('COUNT(todo.id) > 0')
      .getCount();

    return {
      totalCategories,
      categoriesWithTodos
    };
  }
}
