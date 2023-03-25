import { AuthUserDto } from '@auth/dto/auth-user.dto';
import { CreateUserDto } from '@auth/dto/create-user.dto';
import { User } from '@/auth/schemas/user.schema';
import { Document, ObjectId } from 'mongoose';
import { AuthResponse, Tokens } from '@auth/types/auth.types';

export interface IAuthService {
  auth: (dto: AuthUserDto) => Promise<AuthResponse>;
  createUser: (dto: CreateUserDto) => Promise<AuthResponse>;
  generateTokens: (user: ObjectId) => Tokens;
  validateUser: (user: AuthUserDto) => Promise<User & Pick<Document, 'id'>>;
  generateAuthFields: (user: User) => AuthResponse['user'];
}
