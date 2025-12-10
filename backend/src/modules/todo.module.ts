import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoController } from '../controllers/todo.controller';
import { TodoService } from '../services/todo.service';
import { Todo } from '../entities/todo.entity';
import { CategoryModule } from './category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), CategoryModule],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule { }
