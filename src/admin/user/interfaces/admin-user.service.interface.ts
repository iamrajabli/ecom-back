import { ProccessResponse } from '@/admin/types/admin.types';
import { Role } from '@/auth/enums/role.enum';
import { User } from '@/auth/schemas/user.schema';
import { Types } from 'mongoose';

export interface IAdminUserService {
  deleteUser(id: Types.ObjectId): Promise<ProccessResponse>;
  changeRole(id: Types.ObjectId, role: Role): Promise<ProccessResponse>;
  getUsers(): Promise<User[]>;
  getUser(username: string): Promise<User>;
}
