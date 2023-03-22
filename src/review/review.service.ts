import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@auth/schemas/user.schema';
import { Model, Types } from 'mongoose';
import { Book, BookDocument } from '@book/schemas/book.schema';
import { ReviewDto } from '@/review/dto/review.dto';
import { Review, ReviewDocument } from './schemas/review.schema';
import { StarResponse } from './types/review.types';
import { IReviewService } from './interfaces/review.service.interface';
import { ProcessResponse } from '@/types';

@Injectable()
export class ReviewService implements IReviewService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewService: Model<ReviewDocument>,
    @InjectModel(User.name)
    private readonly userService: Model<UserDocument>,
    @InjectModel(Book.name)
    private readonly bookService: Model<BookDocument>,
  ) {}

  async createReview(userId: Types.ObjectId, dto: ReviewDto): Promise<Review> {
    try {
      const user = await this.userService.findById(userId);

      if (!user) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      const book = await this.bookService.findOne({
        _id: dto.bookId,
        isShow: true,
      });

      if (!book) {
        throw new HttpException('Book not found.', HttpStatus.NOT_FOUND);
      }

      const review = await this.reviewService.create({ ...dto, userId });

      user.review.push(review.id);
      await user.save();

      book.review.push(review.id);
      await book.save();

      return review;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateReview(
    userId: Types.ObjectId,
    reviewId: Types.ObjectId,
    dto: ReviewDto,
  ): Promise<Review> {
    try {
      const review = await this.reviewService.findById(reviewId);

      if (!review) {
        throw new HttpException('Review not found.', HttpStatus.NOT_FOUND);
      }

      const book = await this.bookService.findOne({
        _id: dto.bookId,
        isShow: true,
      });

      if (!book) {
        throw new HttpException('Book not found.', HttpStatus.NOT_FOUND);
      }

      await this.reviewService.findByIdAndUpdate(
        reviewId,
        {
          ...dto,
          userId,
        },
        { new: true },
      );

      return review;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getReviews(): Promise<Review[]> {
    try {
      return await this.reviewService.find().exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getReviewsOfBook(bookId: Types.ObjectId): Promise<StarResponse> {
    try {
      const reviews = await this.reviewService.find({ bookId });

      let count = 0;

      reviews.forEach((rev) => {
        count += rev.star;
      });

      return {
        star: count,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getReviewOfUser(
    userId: Types.ObjectId,
    bookId: Types.ObjectId,
  ): Promise<StarResponse> {
    try {
      const review = await this.reviewService.findOne({ userId, bookId });

      if (!review) {
        throw new HttpException('Review not found.', HttpStatus.NOT_FOUND);
      }

      return {
        star: review.star,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async removeReview(
    userId: Types.ObjectId,
    reviewId: Types.ObjectId,
  ): Promise<ProcessResponse> {
    try {
      const review = await this.reviewService.findById(reviewId);

      if (!review) {
        throw new HttpException('Review not found.', HttpStatus.NOT_FOUND);
      }

      await this.userService.findByIdAndUpdate(review.userId, {
        $pull: {
          review: reviewId,
        },
      });

      await this.bookService.findByIdAndUpdate(review.bookId, {
        $pull: {
          review: reviewId,
        },
      });

      await review.remove();

      return {
        message: 'Review successfully removed',
        success: true,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
