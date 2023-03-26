import { faker } from '@faker-js/faker';
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
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async createCategory(dto: CategoryDto) {
    try {
      return await this.categoryModel.create(dto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async updateCategory(id: Types.ObjectId, dto: CategoryDto) {
    try {
      const category = await this.categoryModel.findById(id);
      if (!category) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }

      return await this.categoryModel.findByIdAndUpdate(id, dto, {
        new: true,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteCategory(id: Types.ObjectId) {
    try {
      const category = await this.categoryModel.findById(id);
      if (!category) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }

      await this.categoryModel.findByIdAndDelete(id);

      return {
        message: 'Category successfully deleted',
        success: true,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getCategories() {
    try {
      return await this.categoryModel.find().exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getCategory(id: Types.ObjectId) {
    try {
      const category = await this.categoryModel.findById(id);
      if (!category) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }
      return category;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async seeder(count: number) {
    for (let i = 0; i < count; i++) {
      const category = {
        name: faker.internet.userName(),
        description: faker.commerce.productDescription(),
      };

      await this.categoryModel.create(category);
    }

    return {
      message: `Seeder created ${count} categories`,
      success: true,
    };
  }
}
