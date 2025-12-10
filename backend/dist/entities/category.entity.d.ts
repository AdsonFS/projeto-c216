import { Todo } from './todo.entity';
export declare class Category {
    id: number;
    name: string;
    description?: string;
    color: string;
    todos: Todo[];
    created_at: Date;
    updated_at: Date;
}
