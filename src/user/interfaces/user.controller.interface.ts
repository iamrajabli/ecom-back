import { User } from '@/auth/schemas/user.schema';
import { UpdateUserDto } from '@user/dto/update-user.dto';
import { ProfileResponse, UserResponse } from '@user/types/user.types';
import { Types } from 'mongoose';

export interface IUserController {
  profile(user: User): Promise<ProfileResponse>;
  user(username: string): Promise<UserResponse>;
  users(): Promise<UserResponse[]>;
  updateProfile(
    id: Types.ObjectId,
    dto: UpdateUserDto,
  ): Promise<ProfileResponse>;
  disableProfile(id: Types.ObjectId): Promise<UserResponse>;
}
