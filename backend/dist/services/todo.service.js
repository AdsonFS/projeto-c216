"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const todo_entity_1 = require("../entities/todo.entity");
const category_service_1 = require("./category.service");
let TodoService = class TodoService {
    todoRepository;
    categoryService;
    constructor(todoRepository, categoryService) {
        this.todoRepository = todoRepository;
        this.categoryService = categoryService;
    }
    async create(createTodoDto) {
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
    async findAll() {
        return await this.todoRepository.find({
            order: { created_at: 'DESC' },
            relations: ['categories']
        });
    }
    async findOne(id) {
        const todo = await this.todoRepository.findOne({
            where: { id },
            relations: ['categories']
        });
        if (!todo) {
            throw new common_1.NotFoundException(`Todo with ID ${id} not found`);
        }
        return todo;
    }
    async update(id, updateTodoDto) {
        const { categoryIds, dueDate, ...todoData } = updateTodoDto;
        const todo = await this.findOne(id);
        if (Object.keys(todoData).length > 0) {
            await this.todoRepository.update(id, todoData);
        }
        if (dueDate !== undefined) {
            todo.dueDate = dueDate ? new Date(dueDate) : undefined;
            await this.todoRepository.save(todo);
        }
        if (categoryIds !== undefined) {
            const categories = categoryIds.length > 0
                ? await this.categoryService.findByIds(categoryIds)
                : [];
            todo.categories = categories;
            await this.todoRepository.save(todo);
        }
        return await this.findOne(id);
    }
    async remove(id) {
        const todo = await this.findOne(id);
        await this.todoRepository.remove(todo);
    }
    async toggleComplete(id) {
        const todo = await this.findOne(id);
        todo.completed = !todo.completed;
        return await this.todoRepository.save(todo);
    }
    async getStats() {
        const todos = await this.todoRepository.find({ relations: ['categories'] });
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisWeekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const total = todos.length;
        const completed = todos.filter(todo => todo.completed).length;
        const pending = total - completed;
        const overdue = todos.filter(todo => !todo.completed && todo.dueDate && new Date(todo.dueDate) < now).length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        const categoryCount = new Map();
        todos.forEach(todo => {
            if (todo.categories && todo.categories.length > 0) {
                todo.categories.forEach(category => {
                    const count = categoryCount.get(category.name) || 0;
                    categoryCount.set(category.name, count + 1);
                });
            }
            else {
                const count = categoryCount.get('Sem categoria') || 0;
                categoryCount.set('Sem categoria', count + 1);
            }
        });
        const categoryDistribution = Array.from(categoryCount.entries()).map(([name, count]) => ({
            categoryName: name,
            count,
            color: name === 'Sem categoria' ? '#6c757d' : '#007bff'
        }));
        const dueDateDistribution = {
            today: 0,
            thisWeek: 0,
            thisMonth: 0,
            future: 0,
            overdue: 0
        };
        todos.filter(todo => !todo.completed && todo.dueDate).forEach(todo => {
            const dueDate = new Date(todo.dueDate);
            if (dueDate < now) {
                dueDateDistribution.overdue++;
            }
            else if (dueDate <= today) {
                dueDateDistribution.today++;
            }
            else if (dueDate <= thisWeekEnd) {
                dueDateDistribution.thisWeek++;
            }
            else if (dueDate <= thisMonthEnd) {
                dueDateDistribution.thisMonth++;
            }
            else {
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
};
exports.TodoService = TodoService;
exports.TodoService = TodoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(todo_entity_1.Todo)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        category_service_1.CategoryService])
], TodoService);
//# sourceMappingURL=todo.service.js.map