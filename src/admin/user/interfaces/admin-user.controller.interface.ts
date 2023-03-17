import { ProccessResponse } from '@/admin/types/admin.types';
import { Role } from '@/auth/enums/role.enum';
import { User } from '@/auth/schemas/user.schema';
import { Types } from 'mongoose';

export interface IAdminUserController {
  delete(id: Types.ObjectId): Promise<ProccessResponse>;
  role(id: Types.ObjectId, role: Role): Promise<ProccessResponse>;
  users(): Promise<User[]>;
  user(username: string): Promise<User>;
}
