import { Review } from '@review/schemas/review.schema';
import { Types } from 'mongoose';
import { ReviewDto } from '@review/dto/review.dto';
import { StarResponse } from '@review/types/review.types';

export interface IReviewService {
  createReview(userId: Types.ObjectId, dto: ReviewDto): Promise<Review>;
  updateReview(
    userId: Types.ObjectId,
    reviewId: Types.ObjectId,
    dto: ReviewDto,
  ): Promise<Review>;
  getReviews(): Promise<Review[]>;
  getReviewsOfBook(bookId: Types.ObjectId): Promise<StarResponse>;
  getReviewOfUser(
    userId: Types.ObjectId,
    bookId: Types.ObjectId,
  ): Promise<StarResponse>;
}
