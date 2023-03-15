import { AuthDto } from '../dto/auth.dto';
import { UserDocument } from '../schema/user.schema';

export interface IAuthService {
  login: (dto: AuthDto) => void;
  register: (dto: AuthDto) => void;
  generateTokens: (user: Pick<UserDocument, 'id'>) => void;
  validateToken: () => void;
  generateUserFields: () => void;
}
