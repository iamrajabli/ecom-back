import { User } from '@auth/schemas/user.schema';

export type Tokens = {
  refreshToken: string;
  accessToken: string;
};

export type AuthResponse = {
  user: Pick<User, 'phone' | 'email' | 'name' | 'username'>;
  tokens: Tokens;
};
