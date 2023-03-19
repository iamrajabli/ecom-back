import { Roles } from '@/auth/decorators/roles.decorator';
import { Role } from '@/auth/enums/role.enum';
import { JwtAuthGuard } from '@/auth/guards/auth.guard';
import { RoleGuard } from '@/auth/guards/roles.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';
import { ICategoryController } from './interfaces/category.controller.interface';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.Admin)
@Controller('category')
export class CategoryController implements ICategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() dto: CategoryDto) {
    return await this.categoryService.createCategory(dto);
  }

  @Put(':id')
  async update(@Param('id') id: Types.ObjectId, @Body() dto: CategoryDto) {
    return await this.categoryService.updateCategory(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: Types.ObjectId) {
    return await this.categoryService.deleteCategory(id);
  }

  @Get()
  async categories() {
    return await this.categoryService.getCategories();
  }

  @Get(':id')
  async category(@Param('id') id: Types.ObjectId) {
    return await this.categoryService.getCategory(id);
  }
}
