import { Category } from './category.entity';
export declare class Todo {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    dueDate?: Date;
    categories: Category[];
    created_at: Date;
    updated_at: Date;
}
