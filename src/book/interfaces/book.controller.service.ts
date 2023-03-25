import { ProcessResponse } from '@/types';
import { CreateBookDto } from '@book/dto/create-book.dto';
import { Types } from 'mongoose';
import { UpdateBookDto } from '@book/dto/update-book.dto';
import { Book } from '@book/schemas/book.schema';
import { QueryBookDto } from '@book/dto/query-book.dto';

export interface IBookService {
  createBook(dto: CreateBookDto): Promise<Book>;

  updateBook(id: Types.ObjectId, dto: UpdateBookDto): Promise<Book>;

  changeVisibility(id: Types.ObjectId): Promise<Book>;

  changeVisibilityMany(ids: Types.ObjectId[]): Promise<ProcessResponse>;

  deleteBook(id: Types.ObjectId): Promise<ProcessResponse>;

  getBooks(dto: QueryBookDto): Promise<Book[]>;

  getBook(slug: string): Promise<Book>;

  getForceBooks(): Promise<Book[]>;

  getForceBook(id: Types.ObjectId): Promise<Book>;

  createSlug(title: string): Promise<string>;
}
