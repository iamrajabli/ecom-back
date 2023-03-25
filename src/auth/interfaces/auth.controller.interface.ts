import { AuthUserDto } from '@auth/dto/auth-user.dto';
import { CreateUserDto } from '@auth/dto/create-user.dto';
import { AuthResponse } from '@auth/types/auth.types';

export interface IAuthController {
  register: (dto: CreateUserDto) => Promise<AuthResponse>;
  login: (dto: AuthUserDto) => Promise<AuthResponse>;
  admin: (dto: AuthUserDto) => Promise<AuthResponse>;
  token: (refreshToken: string) => Promise<AuthResponse>;
}
