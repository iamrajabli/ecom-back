import { User } from '@/auth/schemas/user.schema';
import { ProfileResponse, UserResponse } from '@user/types/user.types';
import { Types } from 'mongoose';
import { UpdateUserDto } from '../dto/update-user.dto';

export interface IUserService {
  getUser(username: string): Promise<UserResponse>;
  getUsers(): Promise<UserResponse[]>;
  updateProfile(
    id: Types.ObjectId,
    dto: UpdateUserDto,
  ): Promise<ProfileResponse>;
  disableProfile(id: Types.ObjectId): Promise<ProfileResponse>;
  generateUserFields(user: User): UserResponse;
}
