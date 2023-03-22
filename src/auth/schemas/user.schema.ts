import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Gender } from '@auth/enums/gender.enum';
import { Role } from '@auth/enums/role.enum';
import { Review } from '@/review/schemas/review.schema';
import { Order } from '@/order/schemas/order.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop()
  address: string;

  @Prop({
    type: String,
    enum: Gender,
    default: Gender.Anonym,
  })
  gender: Gender;

  @Prop({
    type: [String],
    enum: Role,
    default: Role.User,
  })
  roles: Role[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Order' }] })
  order: Order[];

  @Prop()
  wishlist: string[];

  @Prop({ default: false })
  isDisabled: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Review' }] })
  review: Review[];

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
