import { Types } from 'mongoose';
import { CategoryDto } from '@category/dto/category.dto';
import { Category } from '@category/schemas/category.schema';
import { ProccessResponse } from '@/types';

export interface ICategoryService {
  createCategory(dto: CategoryDto): Promise<Category>;
  updateCategory(id: Types.ObjectId, dto: CategoryDto): Promise<Category>;
  deleteCategory(id: Types.ObjectId): Promise<ProccessResponse>;
  getCategories(): Promise<Category[]>;
  getCategory(id: Types.ObjectId): Promise<Category>;
}
