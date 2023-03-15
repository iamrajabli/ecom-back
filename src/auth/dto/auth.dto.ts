import { Gender } from '@/auth/enums/gender.enum';

export class AuthDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly phone: string;
  readonly gender: Gender;
  readonly birthInfo: string;
}
