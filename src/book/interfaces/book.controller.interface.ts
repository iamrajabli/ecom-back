import { ProcessResponse } from '@/types';
import { CreateBookDto } from '@book/dto/create-book.dto';
import { Types } from 'mongoose';
import { UpdateBookDto } from '@book/dto/update-book.dto';
import { Book } from '@book/schemas/book.schema';
import { QueryBookDto } from '@book/dto/query-book.dto';

export interface IBookController {
  create(dto: CreateBookDto): Promise<Book>;

  update(id: Types.ObjectId, dto: UpdateBookDto): Promise<Book>;

  visibility(id: Types.ObjectId): Promise<Book>;

  visibilityMany(ids: Types.ObjectId[]): Promise<ProcessResponse>;

  delete(id: Types.ObjectId): Promise<ProcessResponse>;

  books(dto: QueryBookDto): Promise<Book[]>;

  book(slug: string): Promise<Book>;

  booksForce(): Promise<Book[]>;

  bookForce(id: Types.ObjectId): Promise<Book>;
}
