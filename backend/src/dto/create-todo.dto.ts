import { IsString, IsOptional, IsBoolean, IsNotEmpty, MaxLength, IsArray, IsNumber, IsDateString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean = false;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  categoryIds?: number[] = [];
}
