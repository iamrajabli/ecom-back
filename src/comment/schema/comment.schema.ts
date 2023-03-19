import { HydratedDocument, Types } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { User } from '@/auth/schemas/user.schema';
import { Book } from '@/book/schemas/book.schema';

export type ComementDocument = HydratedDocument<Comement>;

@Schema()
export class Comement {
  @Prop({ required: true })
  text: string;

  @Prop({ type: Types.ObjectId, ref: 'Book' })
  book: Book;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;
}

export const ComementSchema = SchemaFactory.createForClass(Comement);
