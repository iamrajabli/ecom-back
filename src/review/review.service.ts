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
    private readonly reviewModel: Model<ReviewDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Book.name)
    private readonly bookModel: Model<BookDocument>,
  ) {}

  async createReview(userId: Types.ObjectId, dto: CreateReviewDto) {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      const book = await this.bookModel
        .findOne({
          _id: dto.book,
          isShow: true,
        })
        .populate({ path: 'review', select: 'user' });

      if (!book) {
        throw new HttpException('Book not found.', HttpStatus.NOT_FOUND);
      }

      // check user former review
      if (book.review.some((rev) => String(rev.user) == String(userId))) {
        throw new HttpException('Review already have.', HttpStatus.NOT_FOUND);
      }

      // get total rev
      const totalRev = Math.ceil(
        this.calculateTotalReview(book.review.length, dto.star, book.rate),
      );

      const review = await this.reviewModel.create({ ...dto, user: userId });

      user.review.push(review.id);
      await user.save();

      book.review.push(review.id);
      book.rate = totalRev > 5 ? 5 : totalRev;
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
      const review = await this.reviewModel
        .findOne({
          _id: reviewId,
          user: userId,
        })
        .populate('book');

      if (!review) {
        throw new HttpException('Review not found.', HttpStatus.NOT_FOUND);
      }

      if (!review.book || !review.book.isShow) {
        throw new HttpException('Book not found.', HttpStatus.NOT_FOUND);
      }

      // get total rev
      const totalRev = Math.ceil(
        this.calculateTotalReview(
          review.book.review.length,
          dto.star,
          review.book.rate,
        ),
      );

      await this.bookModel.findOneAndUpdate(
        {
          slug: review.book.slug,
        },
        {
          rate: totalRev > 5 ? 5 : totalRev,
        },
      );

      return await this.reviewModel.findByIdAndUpdate(reviewId, dto, {
        new: true,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getReviews() {
    try {
      return await this.reviewModel.find().exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getReview(id: Types.ObjectId) {
    try {
      const review = await this.reviewModel.findById(id);

      if (!review) {
        throw new HttpException('Review not found.', HttpStatus.NOT_FOUND);
      }

      return review;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getReviewsOfBook(bookId: Types.ObjectId) {
    try {
      const reviews = await this.reviewModel
        .find({ bookId })
        .populate({ path: 'user', select: 'name' });

      const total = Math.ceil(
        reviews.reduce((acc, rev) => acc + rev.star, 0) / reviews.length,
      );

      return {
        total: total > 5 ? 5 : total,
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
      const review = await this.reviewModel.findOne({ userId, bookId });

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
      const review = await this.reviewModel.findOne({
        _id: reviewId,
        user: userId,
      });

      if (!review) {
        throw new HttpException('Review not found.', HttpStatus.NOT_FOUND);
      }

      await this.userModel.findByIdAndUpdate(review.user, {
        $pull: {
          review: reviewId,
        },
      });

      await this.bookModel.findByIdAndUpdate(review.book, {
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

  calculateTotalReview(revLength: number, userRev: number, currentRev: number) {
    return (currentRev * revLength + userRev) / (revLength + 1);
  }
}
