import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash, compare } from 'bcrypt';
import { Model } from 'mongoose';
import { AuthUserDto } from './dto/auth-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import {
  IAuthService,
  Tokens,
  UserResponse,
} from './interfaces/auth.service.interface';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async auth(dto: AuthUserDto): Promise<UserResponse> {
    const user = await this.validateUser(dto);
    return {
      user: this.generateUserFields(user),
      tokens: this.generateTokens(user.id),
    };
  }

  async createUser(dto: CreateUserDto): Promise<UserResponse> {
    try {
      const oldUser = await this.userModel.findOne({ email: dto.email });

      if (oldUser) {
        throw new HttpException(
          'This user already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      const salt = await genSalt(10);
      const hashedPassword = await hash(dto.password, salt);

      const newUser = await this.userModel.create({
        ...dto,
        password: hashedPassword,
      });

      const user = await this.userModel.findById(newUser.id);

      return {
        user: this.generateUserFields(user),
        tokens: this.generateTokens(user.id),
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async validateUser(dto: AuthUserDto): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email: dto.email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await compare(dto.password, user.password);

    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  generateUserFields(
    user: UserDocument,
  ): Pick<UserDocument, 'phone' | 'email' | 'name'> {
    const { email, name, phone } = user;
    return { email, name, phone };
  }

  generateTokens(id: Pick<UserDocument, 'id'>): Tokens {
    const data = { id };

    const accessToken = this.jwtService.sign(data, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(data, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  async generateNewTokens(refreshToken: string): Promise<UserResponse> {
    try {
      const result = (await this.jwtService.verifyAsync(refreshToken)) as Pick<
        UserDocument,
        'id'
      >;

      if (!result) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const user = await this.userModel.findById(result.id);
      return {
        user: this.generateUserFields(user),
        tokens: this.generateTokens(user.id),
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
