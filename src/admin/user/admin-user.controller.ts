import { Roles } from '@/auth/decorators/roles.decorator';
import { Role } from '@/auth/enums/role.enum';
import { JwtAuthGuard } from '@/auth/guards/auth.guard';
import { RoleGuard } from '@/auth/guards/roles.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { AdminUserService } from './admin-user.service';
import { IAdminUserController } from './interfaces/admin-user.controller.interface';

@Controller('admin/user')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.Admin)
export class AdminUserController implements IAdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Delete(':id')
  async delete(@Param('id') id: Types.ObjectId) {
    return await this.adminUserService.deleteUser(id);
  }

  @Patch('role/:id')
  async role(@Param('id') id: Types.ObjectId, @Body('role') role: Role) {
    return await this.adminUserService.changeRole(id, role);
  }

  @Get()
  async users() {
    return await this.adminUserService.getUsers();
  }

  @Get(':username')
  async user(@Param('username') username: string) {
    return await this.adminUserService.getUser(username);
  }
}
