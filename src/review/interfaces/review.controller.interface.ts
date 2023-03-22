import { Types } from 'mongoose';
import { ReviewDto } from '@review/dto/review.dto';
import { Review } from '@review/schemas/review.schema';
import { StarResponse } from '@review/types/review.types';

export interface IReviewController {
  create(userId: Types.ObjectId, dto: ReviewDto): Promise<Review>;
  update(
    userId: Types.ObjectId,
    reviewId: Types.ObjectId,
    dto: ReviewDto,
  ): Promise<Review>;
  reviews(): Promise<Review[]>;
  reviewsOfBook(bookId: Types.ObjectId): Promise<StarResponse>;
  reviewOfUser(
    userId: Types.ObjectId,
    bookId: Types.ObjectId,
  ): Promise<StarResponse>;
}
