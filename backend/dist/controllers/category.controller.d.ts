import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    create(createCategoryDto: CreateCategoryDto): Promise<import("../entities/category.entity").Category>;
    findAll(): Promise<import("../entities/category.entity").Category[]>;
    getStats(): Promise<{
        totalCategories: number;
        categoriesWithTodos: number;
    }>;
    findOne(id: number): Promise<import("../entities/category.entity").Category>;
    update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<import("../entities/category.entity").Category>;
    remove(id: number): Promise<void>;
}
