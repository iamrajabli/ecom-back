import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Languages } from '@book/enums/book.enums';
import { Review } from '@/review/schemas/review.schema';
import { User } from '@auth/schemas/user.schema';
import { Category } from '@/category/schemas/category.schema';

export type BookDocument = HydratedDocument<Book>;

@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop()
  slug: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  publisher: string;

  @Prop({ required: true })
  publishingYear: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  oldPrice: number;

  @Prop({ required: true })
  stock: number;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Category' })
  category: Category;

  @Prop({ required: true })
  photo: string;

  @Prop({ required: true })
  language: Languages;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Comment' }] })
  comment: Comment[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  wishlist: User[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Review' }] })
  review: Review[];

  @Prop({ default: 0 })
  sold: number;

  @Prop({ default: false })
  isShow: boolean;

  @Prop({ default: 0 })
  view: number;
}

export const BookSchema = SchemaFactory.createForClass(Book);
