import { ProccessResponse } from '@/types';
import { CreateBookDto } from '@book/dto/create-book.dto';
import { Types } from 'mongoose';
import { UpdateBookDto } from '../dto/update-book.dto';
import { Book } from '@book/schemas/book.schema';

export interface IBookController {
  create(dto: CreateBookDto): Promise<Book>;

  update(id: Types.ObjectId, dto: UpdateBookDto): Promise<Book>;

  visibility(id: Types.ObjectId): Promise<Book>;

  visibilityMany(ids: Types.ObjectId[]): Promise<ProccessResponse>;

  delete(id: Types.ObjectId): Promise<ProccessResponse>;

  books(): Promise<Book[]>;

  book(slug: string): Promise<Book>;

  booksForce(): Promise<Book[]>;

  bookForce(id: Types.ObjectId): Promise<Book>;
}
