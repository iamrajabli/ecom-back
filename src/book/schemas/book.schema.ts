import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Languages } from '@book/enums/book.enums';
import { Comment } from './comment.schema';
import { Wishlist } from '@/wishlist/schemas/wishlist.schema';
import { Review } from '@/review/schemas/review.schema';

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

  @Prop({ required: true })
  category: Types.ObjectId;

  @Prop({ required: true })
  photo: string;

  @Prop({ required: true })
  language: Languages;

  @Prop([{ type: Types.ObjectId, ref: 'Comment' }])
  comment: Comment[];

  @Prop([{ type: Types.ObjectId, ref: 'Comment' }])
  wishlist: Wishlist[];

  @Prop([{ type: Types.ObjectId, ref: 'Comment' }])
  review: Review[];

  @Prop()
  sold: number;

  @Prop({ default: false })
  isShow: boolean;
}

export const BookSchema = SchemaFactory.createForClass(Book);
