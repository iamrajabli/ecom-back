import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Gender } from '@auth/enums/gender.enum';
import { Role } from '@auth/enums/role.enum';

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

  @Prop()
  order: string[];

  @Prop()
  wishlist: string[];

  @Prop()
  cart: string[];

  @Prop({ default: false })
  isDisabled: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
