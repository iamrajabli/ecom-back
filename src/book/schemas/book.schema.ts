import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Comment } from './comment.schema';

export type BookDocument = HydratedDocument<Book>;

@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true })
  title: string;

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

  @Prop([{ type: Types.ObjectId, ref: 'Comment' }])
  comment: Comment[];

  @Prop()
  review: number;

  @Prop()
  sold: number;

  @Prop({ default: false })
  isShow: boolean;
}

export const BookSchema = SchemaFactory.createForClass(Book);
