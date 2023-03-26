import { Category, CategoryDocument } from '@/category/schemas/category.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import slugify from 'slugify';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { IBookService } from './interfaces/book.service.interface';
import { Book, BookDocument } from './schemas/book.schema';
import { faker } from '@faker-js/faker';
import { QueryBookDto } from './dto/query-book.dto';

@Injectable()
export class BookService implements IBookService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<BookDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async createSlug(title: string) {
    let slug: string = slugify(title).toLowerCase();
    const bookBySlug = await this.bookModel.findOne({ slug });

    if (bookBySlug) {
      while (bookBySlug.slug === slug) {
        slug += Math.floor(
          Math.random() * Number(Date.now().toString().slice(10, 13)),
        );
      }
    }

    return slug;
  }

  async createBook(dto: CreateBookDto) {
    try {
      const category = await this.categoryModel.findById(dto.category);

      if (!category) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }

      const slug = await this.createSlug(dto.title);

      const book = await this.bookModel.create({ ...dto, slug });

      category.books.push(book.id);
      await category.save();

      return book;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateBook(id: Types.ObjectId, dto: UpdateBookDto) {
    try {
      const book = await this.bookModel.findById(id);

      if (!book) {
        throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
      }

      const slug = await this.createSlug(dto.title);

      return await this.bookModel.findByIdAndUpdate(
        id,
        { ...dto, slug },
        {
          new: true,
        },
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async changeVisibilityMany(ids: Types.ObjectId[]) {
    try {
      const filter = { id: { $in: ids } };

      const update = { $set: { isShow: true } };

      await this.bookModel.updateMany(filter, update);

      return {
        message: 'Books visibility successfully changed',
        success: true,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async changeVisibility(id: Types.ObjectId) {
    try {
      const book = await this.bookModel.findById(id);
      if (!book) {
        throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
      }

      return await this.bookModel.findByIdAndUpdate(
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

  async deleteBook(id: Types.ObjectId) {
    try {
      const book = await this.bookModel.findById(id);

      if (!book) {
        throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
      }

      const category = await this.categoryModel.findById(book.category);

      if (!category) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }

      await this.categoryModel.findByIdAndUpdate(book.category, {
        $pull: { books: book.id },
      });
      await this.bookModel.findByIdAndDelete(id);

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
    price,
    author,
    rated,
    trending,
    bestseller,
    featured,
  }: QueryBookDto) {
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

      // sorting
      if (price) {
        sortConfig = { ...sortConfig, price: price === 'asc' ? 1 : -1 };
      }

      if (trending) {
        sortConfig['view'] = -1;
      }

      if (bestseller) {
        sortConfig['sold'] = -1;
      }

      if (featured) {
        sortConfig['createdAt'] = -1;
      }

      if (rated) {
        sortConfig['rate'] = -1;
      }

      return await this.bookModel
        .find({ isShow: true, ...filterConfig() })
        .skip(offset)
        .sort(sortConfig)
        .limit(limit)
        .exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getRated() {
    try {
      return await this.bookModel
        .find({ isShow: true })
        .sort({ rate: -1 })
        .limit(10)
        .exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getBestseller() {
    try {
      return await this.bookModel
        .find({ isShow: true })
        .sort({ sold: -1 })
        .limit(10)
        .exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getFeatured() {
    try {
      return await this.bookModel
        .find({ isShow: true })
        .sort({ createdAt: -1 })
        .limit(10)
        .exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getTrending() {
    try {
      return await this.bookModel
        .find({ isShow: true })
        .sort({ view: -1 })
        .limit(10)
        .exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getBook(slug: string) {
    try {
      const book = await this.bookModel.findOne({ slug, isShow: true });

      if (!book) {
        throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
      }

      book.view += 1;
      await book.save();

      return book;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getForceBooks() {
    try {
      return await this.bookModel.find().exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getForceBook(id: Types.ObjectId) {
    try {
      const book = await this.bookModel.findById(id).populate('review');

      if (!book) {
        throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
      }
      return book;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async seeder(count: number) {
    const categories = await this.categoryModel.find().exec();

    for (let i = 0; i < count; i++) {
      const book = {
        title: faker.commerce.productName(),
        slug: slugify(faker.commerce.productName()),
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

      const createdBook = await this.bookModel.create(book);

      const category = await this.categoryModel.findById(createdBook.category);

      category.books.push(createdBook.id);

      await category.save();
    }
  }
}
