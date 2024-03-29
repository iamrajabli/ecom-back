import { EmailService } from '@/email/email.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash, compare } from 'bcrypt';
import { Document, Model, ObjectId, Types } from 'mongoose';
import { AuthUserDto } from './dto/auth-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetUserDto } from './dto/reset-user.dto';
import { Role } from './enums/role.enum';
import { IAuthService } from './interfaces/auth.service.interface';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async auth(dto: AuthUserDto) {
    try {
      const user = await this.validateUser(dto);

      if (user.isDisabled) {
        throw new HttpException(
          'This account is disabled. Сontact with support.',
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        user: this.generateAuthFields(user),
        tokens: this.generateTokens(user.id),
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async admin(dto: AuthUserDto) {
    try {
      const user = await this.validateUser(dto);

      if (user.isDisabled) {
        throw new HttpException(
          'This account is disabled. Сontact with support.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!user.roles.includes(Role.Admin)) {
        throw new HttpException(
          'Forbidden resource. Сontact with support.',
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        user: this.generateAuthFields(user),
        tokens: this.generateTokens(user.id),
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async createUser(dto: CreateUserDto) {
    try {
      const existingUser = await this.userModel.findOne({
        $or: [
          { email: dto.email },
          { phone: dto.phone },
          { username: dto.username },
        ],
      });

      const uniqueFields = ['email', 'phone', 'username'];
      const messages = [];

      if (existingUser) {
        for (const value of uniqueFields) {
          if (existingUser[value] === dto[value]) {
            messages.push(`${value} already exists`);
          }
        }

        if (messages.length > 0) {
          throw new HttpException(messages.join(', '), HttpStatus.BAD_REQUEST);
        }
      }

      const salt = await genSalt(10);

      const hashedPassword = await hash(dto.password, salt);

      const newUser = await this.userModel.create({
        ...dto,
        password: hashedPassword,
      });

      const user = await this.userModel.findById(newUser.id);

      return {
        user: this.generateAuthFields(user),
        tokens: this.generateTokens(user.id),
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async validateUser(dto: AuthUserDto) {
    const user = await this.userModel.findOne({
      $or: [{ email: dto.login }, { username: dto.login }],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await compare(dto.password, user.password);

    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user as User & Pick<Document, 'id'>;
  }

  generateAuthFields(user: User) {
    const { email, name, phone, username } = user;
    return { email, name, phone, username };
  }

  generateTokens(id: ObjectId) {
    const data = { id };

    const accessToken = this.jwtService.sign(data, { expiresIn: '10h' });
    const refreshToken = this.jwtService.sign(data, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  async generateNewTokens(refreshToken: string) {
    try {
      const result = await this.verifyToken(refreshToken);

      const user = await this.userModel.findById(result.id);
      return {
        user: this.generateAuthFields(user),
        tokens: this.generateTokens(user.id),
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async reset(login: string) {
    try {
      const user = await this.userModel.findOne({
        $or: [{ email: login }, { username: login }],
      });

      if (!user) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      if (user.isDisabled) {
        throw new HttpException(
          'This account is disabled. Сontact with support.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const token = this.generateResetToken(login);

      const link = 'http://ecom.com/token=' + token;

      return await this.emailService.sendEmail(
        user.email,
        'Reset password for ' + user.name,
        link,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async resetPassword(dto: ResetUserDto) {
    try {
      const result = await this.verifyToken(dto.token);

      const salt = await genSalt(10);

      await this.userModel.findOneAndUpdate(
        {
          $or: [{ email: result.login }, { username: result.login }],
        },
        {
          $set: {
            password: await hash(dto.password, salt),
          },
        },
      );

      return {
        message: 'Password successfully changed.',
        success: true,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  generateResetToken(login: string) {
    try {
      const data = { login };

      return this.jwtService.sign(data, { expiresIn: '30m' });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async verifyToken(token: string) {
    try {
      const result = (await this.jwtService.verifyAsync(token)) as Record<
        'login' | 'id',
        string | Types.ObjectId
      >;

      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
