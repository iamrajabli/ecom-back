import { AuthUserDto } from '@auth/dto/auth-user.dto';
import { CreateUserDto } from '@auth/dto/create-user.dto';
import { UserResponse } from './auth.service.interface';

export interface IAuthController {
  register: (dto: CreateUserDto) => Promise<UserResponse>;
  login: (dto: AuthUserDto) => Promise<UserResponse>;
  token: (refreshToken: string) => Promise<UserResponse>;
}
