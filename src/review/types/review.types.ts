import { ReviewOfBookDto } from '@review/dto/review-book.dto';

export type StarResponse = {
  star: number;
  comment: string;
};

export type ReviewOfBook = {
  total: number;
  reviews: ReviewOfBookDto[];
};
