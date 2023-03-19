import { Role } from '@/auth/enums/role.enum';
import { User } from '@/auth/schemas/user.schema';
import { ProccessResponse } from '@/types';
import { UpdateUserDto } from '@user/dto/update-user.dto';
import { ProfileResponse, UserResponse } from '@user/types/user.types';
import { Types } from 'mongoose';

export interface IUserController {
  profile(user: User): Promise<ProfileResponse>;
  updateProfile(
    id: Types.ObjectId,
    dto: UpdateUserDto,
  ): Promise<ProfileResponse>;
  disableProfile(id: Types.ObjectId): Promise<UserResponse>;
  delete(id: Types.ObjectId): Promise<ProccessResponse>;
  role(id: Types.ObjectId, role: Role): Promise<ProccessResponse>;
  users(): Promise<User[]>;
  user(id: Types.ObjectId): Promise<User>;
}
