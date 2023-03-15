import { AuthUserDto } from '@auth/dto/auth-user.dto';
import { CreateUserDto } from '@auth/dto/create-user.dto';
import { UserDocument } from '@auth/schema/user.schema';

export interface IAuthService {
  auth: (dto: AuthUserDto) => void;
  createUser: (dto: CreateUserDto) => Promise<UserResponse>;
  generateTokens: (user: Pick<UserDocument, 'id'>) => void;
  validateUser: (
    user: Pick<UserDocument, 'email' | 'password'>,
  ) => Promise<UserDocument>;
  generateUserFields: (user: UserDocument) => void;
}

export interface Tokens {
  refreshToken: string;
  accessToken: string;
}

export interface UserResponse {
  user: Pick<UserDocument, 'phone' | 'email' | 'name'>;
  tokens: Tokens;
}
