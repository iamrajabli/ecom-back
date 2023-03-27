import { Types } from 'mongoose';
import { BookSort, Languages } from '@/book/enums/book.enum';

export class QueryBookDto {
  query: string;
  max: number;
  min: number;
  offset: number;
  limit: number;
  lang: Languages;
  category: Types.ObjectId;
  price: BookSort;
  author: BookSort;
  rated: BookSort;
  trending: BookSort;
  bestseller: BookSort;
  featured: BookSort;
  discount: BookSort;
}
