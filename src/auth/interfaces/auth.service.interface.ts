import { AuthUserDto } from '@auth/dto/auth-user.dto';
import { CreateUserDto } from '@auth/dto/create-user.dto';
import { User } from '@/auth/schemas/user.schema';
import { Document, ObjectId } from 'mongoose';
import { AuthResponse } from '@auth/types/auth.types';

export interface IAuthService {
  auth: (dto: AuthUserDto) => void;
  createUser: (dto: CreateUserDto) => Promise<AuthResponse>;
  generateTokens: (user: ObjectId) => void;
  validateUser: (user: AuthUserDto) => Promise<User & Pick<Document, 'id'>>;
  generateAuthFields: (user: User) => void;
}
