import { Category, CategoryDocument } from '@/category/schemas/category.schema';
import { ProccessResponse } from '@/types';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import slugify from 'slugify';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { IBookService } from './interfaces/book.controller.service';
import { Book, BookDocument } from './schemas/book.schema';

@Injectable()
export class BookService implements IBookService {
  constructor(
    @InjectModel(Book.name) private readonly bookService: Model<BookDocument>,
    @InjectModel(Category.name)
    private readonly categoryService: Model<CategoryDocument>,
  ) {}

  async createBook(dto: CreateBookDto): Promise<Book> {
    try {
      const category = await this.categoryService.findById(dto.category);

      if (!category) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }

      let slug: string = slugify(dto.title).toLowerCase();
      const bookBySlug = await this.bookService.findOne({ slug: slug });

      if (bookBySlug) {
        while (bookBySlug.slug === slug) {
          slug += Math.floor(
            Math.random() * Number(Date.now().toString().slice(10, 13)),
          );
        }
      }

      const book = await this.bookService.create({ ...dto, slug });

      category.books.push(book.id);
      await category.save();

      return book;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateBook(id: Types.ObjectId, dto: UpdateBookDto): Promise<Book> {
    try {
      const book = await this.bookService.findById(id);
      if (!book) {
        throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
      }

      return await this.bookService.findByIdAndUpdate(id, dto, {
        new: true,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async changeVisibilityMany(ids: Types.ObjectId[]): Promise<ProccessResponse> {
    try {
      const filter = { id: { $in: ids } };

      const update = { $set: { isShow: true } };

      await this.bookService.updateMany(filter, update);

      return {
        message: 'Books visibility successfully changed',
        success: true,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async changeVisibility(id: Types.ObjectId): Promise<Book> {
    try {
      const book = await this.bookService.findById(id);
      if (!book) {
        throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
      }

      return await this.bookService.findByIdAndUpdate(
        id,
        { isShow: !book.isShow },
        {
          new: true,
        },
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteBook(id: Types.ObjectId): Promise<ProccessResponse> {
    try {
      const book = await this.bookService.findById(id);

      if (!book) {
        throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
      }

      const category = await this.categoryService.findById(book.category);

      if (!category) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }

      await this.categoryService.findByIdAndUpdate(book.category, {
        $pull: { books: book.id },
      });
      await this.bookService.findByIdAndDelete(id);

      return {
        message: 'Book successfully deleted',
        success: true,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getBooks(): Promise<Book[]> {
    try {
      return await this.bookService.find({ isShow: true }).exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getBook(slug: string): Promise<Book> {
    try {
      const book = await this.bookService.findOne({ slug, isShow: true });

      if (!book) {
        throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
      }
      return book;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getForceBooks(): Promise<Book[]> {
    try {
      return await this.bookService.find().exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getForceBook(id: Types.ObjectId): Promise<Book> {
    try {
      const book = await this.bookService.findById(id);

      if (!book) {
        throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
      }
      return book;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
