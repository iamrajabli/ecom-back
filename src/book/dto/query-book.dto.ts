import { Types } from 'mongoose';
import { BookSort } from '@/book/enums/book.enum';

export class QueryBookDto {
  query: string;
  max: number;
  min: number;
  offset: number;
  limit: number;
  categoryId: Types.ObjectId;
  price: BookSort;
  author: BookSort;
  rated: BookSort;
  trending: BookSort;
  bestseller: BookSort;
  featured: BookSort;
}
