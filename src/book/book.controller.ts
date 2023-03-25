import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from '@book/dto/create-book.dto';
import { Types } from 'mongoose';
import { UpdateBookDto } from './dto/update-book.dto';
import { IBookController } from './interfaces/book.controller.interface';
import { JwtAuthGuard } from '@/auth/guards/auth.guard';
import { RoleGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Role } from '@/auth/enums/role.enum';
import { QueryBookDto } from './dto/query-book.dto';

@Controller('book')
export class BookController implements IBookController {
  constructor(private readonly bookService: BookService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() dto: CreateBookDto) {
    return await this.bookService.createBook(dto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @UsePipes(new ValidationPipe())
  @Put(':id')
  async update(@Param('id') id: Types.ObjectId, @Body() dto: UpdateBookDto) {
    return await this.bookService.updateBook(id, dto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Patch('visibility/:id')
  async visibility(@Param('id') id: Types.ObjectId) {
    return await this.bookService.changeVisibility(id);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Patch('visibility')
  async visibilityMany(@Body('ids') ids: Types.ObjectId[]) {
    return await this.bookService.changeVisibilityMany(ids);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id') id: Types.ObjectId) {
    return await this.bookService.deleteBook(id);
  }

  @Get()
  async books(@Query() query: QueryBookDto) {
    return await this.bookService.getBooks(query);
  }

  @Get('rated')
  async rated() {
    return await this.bookService.getRated();
  }

  @Get('bestseller')
  async bestseller() {
    return await this.bookService.getBestseller();
  }

  @Get('featured')
  async featured() {
    return await this.bookService.getFeatured();
  }

  @Get('trending')
  async trending() {
    return await this.bookService.getTrending();
  }

  @Get('slug/:slug')
  async book(@Param('slug') slug: string) {
    return await this.bookService.getBook(slug);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Get('force')
  async booksForce() {
    return await this.bookService.getForceBooks();
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Get('force/:id')
  async bookForce(@Param('id') id: Types.ObjectId) {
    return await this.bookService.getForceBook(id);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Post('seeder/:count')
  async seeder(@Param('count') count: number) {
    return await this.bookService.seeder(count);
  }
}
