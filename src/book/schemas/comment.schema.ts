import { HydratedDocument, Types } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Book } from './book.schema';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop()
  username: string;

  @Prop()
  text: string;

  @Prop({ type: Types.ObjectId, ref: 'Book' })
  book: Book;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
