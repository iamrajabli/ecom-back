import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@auth/schemas/user.schema';
import { Model, Types } from 'mongoose';
import { Book, BookDocument } from '@book/schemas/book.schema';
import { CreateReviewDto } from '@/review/dto/create-review.dto';
import { Review, ReviewDocument } from './schemas/review.schema';
import { IReviewService } from './interfaces/review.service.interface';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewOfBookDto } from './dto/review-book.dto';

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

  async createReview(userId: Types.ObjectId, dto: CreateReviewDto) {
    try {
      const user = await this.userService.findById(userId);

      if (!user) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      const book = await this.bookService.findOne({
        _id: dto.book,
        isShow: true,
      });

      if (!book) {
        throw new HttpException('Book not found.', HttpStatus.NOT_FOUND);
      }

      const review = await this.reviewService.create({ ...dto, user: userId });

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
    dto: UpdateReviewDto,
  ) {
    try {
      const review = await this.reviewService
        .findOne({ id: reviewId, user: userId })
        .populate('book', 'isShow');

      if (!review) {
        throw new HttpException('Review not found.', HttpStatus.NOT_FOUND);
      }

      if (!review.book || !review.book.isShow) {
        throw new HttpException('Book not found.', HttpStatus.NOT_FOUND);
      }

      return await this.reviewService.findByIdAndUpdate(reviewId, dto, {
        new: true,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getReviews() {
    try {
      return await this.reviewService.find().exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getReviewsOfBook(bookId: Types.ObjectId) {
    try {
      const reviews = await this.reviewService
        .find({ bookId })
        .populate({ path: 'user', select: 'name' });

      return {
        total: reviews.reduce((acc, rev) => acc + rev.star, 0) / reviews.length,
        reviews: reviews.map(
          (rev) => new ReviewOfBookDto(rev.star, rev.comment, rev.user.name),
        ),
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getReviewOfUser(userId: Types.ObjectId, bookId: Types.ObjectId) {
    try {
      const review = await this.reviewService.findOne({ userId, bookId });

      if (!review) {
        throw new HttpException('Review not found.', HttpStatus.NOT_FOUND);
      }

      return {
        star: review.star,
        comment: review.comment,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async removeReview(userId: Types.ObjectId, reviewId: Types.ObjectId) {
    try {
      const review = await this.reviewService.findOne({
        _id: reviewId,
        user: userId,
      });

      if (!review) {
        throw new HttpException('Review not found.', HttpStatus.NOT_FOUND);
      }

      await this.userService.findByIdAndUpdate(review.user, {
        $pull: {
          review: reviewId,
        },
      });

      await this.bookService.findByIdAndUpdate(review.book, {
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
