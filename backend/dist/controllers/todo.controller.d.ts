import { TodoService } from '../services/todo.service';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
export declare class TodoController {
    private readonly todoService;
    constructor(todoService: TodoService);
    create(createTodoDto: CreateTodoDto): Promise<import("../entities/todo.entity").Todo>;
    findAll(): Promise<import("../entities/todo.entity").Todo[]>;
    getStats(): Promise<any>;
    findOne(id: number): Promise<import("../entities/todo.entity").Todo>;
    update(id: number, updateTodoDto: UpdateTodoDto): Promise<import("../entities/todo.entity").Todo>;
    toggleComplete(id: number): Promise<import("../entities/todo.entity").Todo>;
    remove(id: number): Promise<void>;
}
