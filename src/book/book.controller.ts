import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from '@book/dto/create-book.dto';
import { Types } from 'mongoose';
import { UpdateBookDto } from './dto/update-book.dto';
import { IBookController } from './interfaces/book.controller.interface';

@Controller('book')
export class BookController implements IBookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async create(@Body() dto: CreateBookDto) {
    return await this.bookService.createBook(dto);
  }

  @Put(':id')
  async update(@Param('id') id: Types.ObjectId, @Body() dto: UpdateBookDto) {
    return await this.bookService.updateBook(id, dto);
  }

  @Patch('visibility/:id')
  async visibility(@Param('id') id: Types.ObjectId) {
    return await this.bookService.changeVisibility(id);
  }

  @Patch('visibility')
  async visibilityMany(@Body('ids') ids: Types.ObjectId[]) {
    return await this.bookService.changeVisibilityMany(ids);
  }

  @Delete(':id')
  async delete(@Param('id') id: Types.ObjectId) {
    return await this.bookService.deleteBook(id);
  }

  @Get()
  async books() {
    return await this.bookService.getBooks();
  }

  @Get('slug/:slug')
  async book(@Param('slug') slug: string) {
    return await this.bookService.getBook(slug);
  }

  @Get('force')
  async booksForce() {
    return await this.bookService.getForceBooks();
  }

  @Get('force/:id')
  async bookForce(@Param('id') id: Types.ObjectId) {
    return await this.bookService.getForceBook(id);
  }
}
