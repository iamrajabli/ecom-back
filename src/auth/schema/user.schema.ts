import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Gender } from '@auth/enums/gender.enum';
import { Role } from '@auth/enums/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  name: string;

  @Prop()
  phone: string;

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
  roles: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
