import { Role } from '@/auth/enums/role.enum';
import { User } from '@/auth/schemas/user.schema';
import { ProcessResponse } from '@/types';
import { ProfileResponse, UserResponse } from '@user/types/user.types';
import { Types } from 'mongoose';
import { UpdateUserDto } from 'user/dto/update-user.dto';

export interface IUserService {
  updateProfile(
    id: Types.ObjectId,
    dto: UpdateUserDto,
  ): Promise<ProfileResponse>;
  disableProfile(id: Types.ObjectId): Promise<UserResponse>;
  deleteUser(id: Types.ObjectId): Promise<ProcessResponse>;
  changeRole(id: Types.ObjectId, role: Role): Promise<ProcessResponse>;
  getUsers(): Promise<User[]>;
  getUser(id: Types.ObjectId): Promise<User>;
}
