import { HydratedDocument, Types } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Book } from '@/book/schemas/book.schema';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop([{ type: Types.ObjectId, ref: 'Book' }])
  book: Book[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
