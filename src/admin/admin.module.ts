import { UserSchema } from '@/auth/schemas/user.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminUserController } from './user/admin-user.controller';
import { AdminUserService } from './user/admin-user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [AdminUserController],
  providers: [AdminUserService],
})
export class AdminModule {}
