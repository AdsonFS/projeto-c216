import { Repository } from 'typeorm';
import { Todo } from '../entities/todo.entity';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { CategoryService } from './category.service';
export declare class TodoService {
    private readonly todoRepository;
    private readonly categoryService;
    constructor(todoRepository: Repository<Todo>, categoryService: CategoryService);
    create(createTodoDto: CreateTodoDto): Promise<Todo>;
    findAll(): Promise<Todo[]>;
    findOne(id: number): Promise<Todo>;
    update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo>;
    remove(id: number): Promise<void>;
    toggleComplete(id: number): Promise<Todo>;
    getStats(): Promise<any>;
}
