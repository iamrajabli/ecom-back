import { Review } from '@review/schemas/review.schema';
import { Types } from 'mongoose';
import { CreateReviewDto } from '@/review/dto/create-review.dto';
import { ReviewOfBook, StarResponse } from '@review/types/review.types';

export interface IReviewService {
  createReview(userId: Types.ObjectId, dto: CreateReviewDto): Promise<Review>;
  updateReview(
    userId: Types.ObjectId,
    reviewId: Types.ObjectId,
    dto: CreateReviewDto,
  ): Promise<Review>;
  getReviews(): Promise<Review[]>;
  getReview(id: Types.ObjectId): Promise<Review>;
  getReviewsOfBook(bookId: Types.ObjectId): Promise<ReviewOfBook>;
  getReviewOfUser(
    userId: Types.ObjectId,
    bookId: Types.ObjectId,
  ): Promise<StarResponse>;
  calculateTotalReview(
    revLength: number,
    userRev: number,
    currentRev: number,
  ): number;
}
