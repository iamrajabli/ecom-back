import { User } from '@/auth/schemas/user.schema';

export type UserResponse = Pick<
  User,
  'name' | 'username' | 'gender' | 'createdAt'
>;

export type ProfileResponse = Omit<User, 'password' | 'roles'>;
