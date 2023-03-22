import { User, UserDocument } from '@/auth/schemas/user.schema';
import { Book, BookDocument } from '@/book/schemas/book.schema';
import { ProcessResponse } from '@/types';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IWishlistService } from './interfaces/wishlist.service.interface';

@Injectable()
export class WishlistService implements IWishlistService {
  constructor(
    @InjectModel(User.name)
    private readonly userService: Model<UserDocument>,
    @InjectModel(Book.name)
    private readonly bookService: Model<BookDocument>,
  ) {}

  async addToWishlist(
    userId: Types.ObjectId,
    bookId: Types.ObjectId,
  ): Promise<ProcessResponse> {
    try {
      const user = await this.userService.findById(userId);

      if (!user) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      const book = await this.bookService.findOne({
        _id: bookId,
        isShow: true,
      });

      if (!book) {
        throw new HttpException('Book not found.', HttpStatus.NOT_FOUND);
      }

      if (user.wishlist.includes(book.id)) {
        throw new HttpException(
          'Book already added to wishlist.',
          HttpStatus.NOT_FOUND,
        );
      }

      if (book.wishlist.includes(user.id)) {
        throw new HttpException(
          'User already added this book to wishlist.',
          HttpStatus.NOT_FOUND,
        );
      }

      user.wishlist.push(book.id);
      await user.save();

      book.wishlist.push(user.id);
      await book.save();

      return {
        message: 'Successfully added to wishlist.',
        success: true,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async removeFromWishlist(
    userId: Types.ObjectId,
    bookId: Types.ObjectId,
  ): Promise<ProcessResponse> {
    try {
      const book = await this.bookService.findOne({
        _id: bookId,
        isShow: true,
      });

      if (!book) {
        throw new HttpException('Book not found.', HttpStatus.NOT_FOUND);
      }

      await this.userService.findByIdAndUpdate(userId, {
        $pull: { wishlist: book.id },
      });

      await this.bookService.findByIdAndUpdate(book.id, {
        $pull: { wishlist: userId },
      });

      return {
        message: 'Successfully removed from wishlist.',
        success: true,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async removeWishlist(userId: Types.ObjectId): Promise<ProcessResponse> {
    try {
      const user = await this.userService.findById(userId);

      if (!user) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      await this.bookService.updateMany(
        { id: { $in: user.wishlist } },
        { $pull: { wishlist: user.id } },
      );

      user.wishlist = [];
      await user.save();

      return {
        message: 'Wishlist successfully reseted.',
        success: true,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
