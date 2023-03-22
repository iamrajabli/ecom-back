import { Types } from 'mongoose';
import { CategoryDto } from '@category/dto/category.dto';
import { Category } from '@category/schemas/category.schema';
import { ProcessResponse } from '@/types';

export interface ICategoryController {
  create(dto: CategoryDto): Promise<Category>;
  update(id: Types.ObjectId, dto: CategoryDto): Promise<Category>;
  delete(id: Types.ObjectId): Promise<ProcessResponse>;
  categories(): Promise<Category[]>;
  category(id: Types.ObjectId): Promise<Category>;
}
