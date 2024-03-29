import { Types } from 'mongoose';
import { CategoryDto } from '@category/dto/category.dto';
import { Category } from '@category/schemas/category.schema';
import { ProcessResponse } from '@/types';

export interface ICategoryService {
  createCategory(dto: CategoryDto): Promise<Category>;
  updateCategory(id: Types.ObjectId, dto: CategoryDto): Promise<Category>;
  deleteCategory(id: Types.ObjectId): Promise<ProcessResponse>;
  getCategories(): Promise<Category[]>;
  getCategory(id: Types.ObjectId): Promise<Category>;
}
