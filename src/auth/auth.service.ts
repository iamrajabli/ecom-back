import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcrypt';
import { Model } from 'mongoose';
import { AuthDto } from './dto/auth.dto';
import { IAuthService } from './interfaces/auth.interface';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  login(dto: Pick<AuthDto, 'email' | 'password'>) {
    return dto;
  }

  async register(dto: AuthDto) {
    try {
      const oldUser = await this.userModel.findOne({ email: dto.email });
      console.log(oldUser);

      if (oldUser) {
        throw new BadRequestException('This user already exist.');
      }

      const salt = await genSalt(10);

      const user = await this.userModel.create({
        ...dto,
        password: await hash(dto.password, salt),
      });

      return {
        user,
        tokens: {
          ...this.generateTokens(user.id),
        },
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new BadRequestException(err.message);
      }
    }
  }
  generateTokens(user: Pick<UserDocument, 'id'>) {
    const data = { id: user.id };

    const accessToken = this.jwtService.sign(data, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(data, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
  validateToken() {}
  generateUserFields() {}
}
