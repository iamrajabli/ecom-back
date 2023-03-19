import { ProccessResponse } from '@/types';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CategoryDto } from './dto/category.dto';
import { ICategoryService } from './interfaces/category.service.interface';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoryService implements ICategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryService: Model<CategoryDocument>,
  ) {}

  async createCategory(dto: CategoryDto): Promise<Category> {
    try {
      return await this.categoryService.create(dto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async updateCategory(
    id: Types.ObjectId,
    dto: CategoryDto,
  ): Promise<Category> {
    try {
      const category = await this.categoryService.findById(id);
      if (!category) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }

      return await this.categoryService.findByIdAndUpdate(id, dto, {
        new: true,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteCategory(id: Types.ObjectId): Promise<ProccessResponse> {
    try {
      const category = await this.categoryService.findById(id);
      if (!category) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }

      await this.categoryService.findByIdAndDelete(id);

      return {
        message: 'Category successfully deleted',
        success: true,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getCategories(): Promise<Category[]> {
    try {
      return await this.categoryService.find().exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getCategory(id: Types.ObjectId): Promise<Category> {
    try {
      const category = await this.categoryService.findById(id);
      if (!category) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }
      return category;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
