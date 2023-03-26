import { Types } from 'mongoose';
import { CreateReviewDto } from '@/review/dto/create-review.dto';
import { Review } from '@review/schemas/review.schema';
import { ReviewOfBook, StarResponse } from '@review/types/review.types';
import { UpdateReviewDto } from '../dto/update-review.dto';

export interface IReviewController {
  create(userId: Types.ObjectId, dto: CreateReviewDto): Promise<Review>;
  update(
    userId: Types.ObjectId,
    reviewId: Types.ObjectId,
    dto: UpdateReviewDto,
  ): Promise<Review>;
  reviews(): Promise<Review[]>;
  review(id: Types.ObjectId): Promise<Review>;
  reviewsOfBook(bookId: Types.ObjectId): Promise<ReviewOfBook>;
  reviewOfUser(
    userId: Types.ObjectId,
    bookId: Types.ObjectId,
  ): Promise<StarResponse>;
}
