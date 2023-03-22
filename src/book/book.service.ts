import { Category, CategoryDocument } from '@/category/schemas/category.schema';
import { ProcessResponse } from '@/types';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import slugify from 'slugify';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { IBookService } from './interfaces/book.controller.service';
import { Book, BookDocument } from './schemas/book.schema';
import { faker } from '@faker-js/faker';
import { QueryBookDto } from './dto/query-book.dto';

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

  async changeVisibilityMany(ids: Types.ObjectId[]): Promise<ProcessResponse> {
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

  async deleteBook(id: Types.ObjectId): Promise<ProcessResponse> {
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

  async getBooks({
    limit = 20,
    max,
    min = 0,
    offset,
    query,
    categoryId,
    priceSort,
    author,
  }: QueryBookDto): Promise<Book[]> {
    try {
      const priceFilter = { price: { $gte: min } };
      const categoryFilter = {};
      const searchFilter = { title: { $regex: new RegExp(query, 'i') } };
      const authorFilter = { author: { $regex: new RegExp(author, 'i') } };
      let sortConfig = {};

      const filterConfig = () => {
        // if have max then priceFilter must be => { price: { $gte: xxx, $lte: xxx } }
        max ? (priceFilter.price['$lte'] = max) : null;

        // if have categoryId then categoryFilter must be => { categoryId: { $eq: "xxx" } }
        categoryId ? (categoryFilter['category'] = { $eq: categoryId }) : null;

        return {
          ...categoryFilter,
          ...priceFilter,
          ...searchFilter,
          ...authorFilter,
        };
      };

      if (priceSort) {
        sortConfig = { price: priceSort === 'asc' ? 1 : -1 };
      }

      return await this.bookService
        .find({ isShow: true, ...filterConfig() })
        .skip(offset)
        .sort(sortConfig)
        .limit(limit)
        .exec();
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

  async seeder(count: number) {
    const categories = await this.categoryService.find().exec();

    for (let i = 0; i < count; i++) {
      const book = {
        title: faker.commerce.productName(),
        slug: slugify(faker.commerce.productName()).toLowerCase(),
        author: faker.name.firstName(),
        publisher: faker.company.name(),
        publishingYear:
          new Date().getFullYear() - Math.floor(Math.random() * 20),
        description: faker.commerce.productDescription(),
        price: Number(faker.commerce.price()),
        oldPrice: Number(faker.commerce.price()) + 500,
        stock: Number(faker.commerce.price()),
        category: categories[Math.floor(Math.random() * categories.length)].id,
        photo: faker.image.imageUrl(),
        language: ['az', 'en', 'ru', 'tr', 'gr'][Math.floor(Math.random() * 4)],
        isShow: true,
      };

      const createdBook = await this.bookService.create(book);

      const category = await this.categoryService.findById(
        createdBook.category,
      );

      category.books.push(createdBook.id);

      await category.save();
    }
  }
}
