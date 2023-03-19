import { ProccessResponse } from '@/types';
import { CreateBookDto } from '@book/dto/create-book.dto';
import { Types } from 'mongoose';
import { UpdateBookDto } from '../dto/update-book.dto';
import { Book } from '@book/schemas/book.schema';

export interface IBookService {
  createBook(dto: CreateBookDto): Promise<Book>;

  updateBook(id: Types.ObjectId, dto: UpdateBookDto): Promise<Book>;

  changeVisibility(id: Types.ObjectId): Promise<Book>;

  changeVisibilityMany(ids: Types.ObjectId[]): Promise<ProccessResponse>;

  deleteBook(id: Types.ObjectId): Promise<ProccessResponse>;

  getBooks(): Promise<Book[]>;

  getBook(slug: string): Promise<Book>;

  getForceBooks(): Promise<Book[]>;

  getForceBook(id: Types.ObjectId): Promise<Book>;
}
