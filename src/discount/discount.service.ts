import { Book, BookDocument } from '@/book/schemas/book.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { IDiscountService } from './interfaces/discount.service.interface';
import { Discount, DiscountDocument } from './schema/discount.schema';

@Injectable()
export class DiscountService implements IDiscountService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<BookDocument>,
    @InjectModel(Discount.name)
    private readonly discountModel: Model<DiscountDocument>,
  ) {}

  async createDiscount(dto: CreateDiscountDto) {
    try {
      const book = await this.bookModel.findOne({
        _id: dto.book,
        isShow: true,
      });

      if (!book) {
        throw new HttpException('Book not found.', HttpStatus.NOT_FOUND);
      }

      const alreadyDiscount = await this.discountModel.findOne({
        book: dto.book,
        endDate: {
          $gt: new Date(),
        },
      });

      if (alreadyDiscount) {
        throw new HttpException(
          'There is already a discount for this book.',
          HttpStatus.NOT_FOUND,
        );
      }

      // validate
      this.validateDate(dto.startDate, dto.endDate);

      const discount = await this.discountModel.create(dto);

      book.discount = discount.id;

      await book.save();

      return discount;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateDiscount(id: Types.ObjectId, dto: UpdateDiscountDto) {
    try {
      const discount = await this.discountModel.findOneAndUpdate(id, dto, {
        new: true,
      });

      if (!discount) {
        throw new HttpException('Discount not found.', HttpStatus.NOT_FOUND);
      }

      // validate
      this.validateDate(dto.startDate, dto.endDate);

      return discount;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async removeDiscount(id: Types.ObjectId) {
    try {
      const discount = await this.discountModel.findById(id);

      if (!discount) {
        throw new HttpException('Discount not found.', HttpStatus.NOT_FOUND);
      }

      await this.bookModel.findByIdAndUpdate(discount.book, {
        $unset: { discount: 1 },
      });

      await discount.remove();

      return {
        message: 'Discount successfuly deleted',
        success: true,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getDiscounts({ active, soon, ended }) {
    try {
      const filter = {};
      const currentDate = new Date();

      if (active) {
        filter['startDate'] = { $lt: currentDate };
      }

      if (soon) {
        filter['startDate'] = { $gt: currentDate };
      }

      if (ended) {
        filter['endDate'] = { $lt: currentDate };
      }
      const discount = await this.discountModel.find(filter).exec();

      return discount;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getDiscount(id: Types.ObjectId) {
    try {
      const discount = await this.discountModel.findById(id);

      if (!discount) {
        throw new HttpException('Discount not found.', HttpStatus.NOT_FOUND);
      }

      return discount;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getDiscountOfBook(id: Types.ObjectId) {
    try {
      return await this.discountModel.findOne({ book: id });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  validateDate(startDate: Date, endDate: Date) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const deadline = end.getTime() - start.getTime();

    if (deadline < 0) {
      throw new HttpException(
        'The end date cannot be less than the start date.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (end < new Date()) {
      throw new HttpException(
        'You cannot create a discount that will start in the past.',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
