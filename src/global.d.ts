import { EUserRole, User } from '@/modules/user/entity/user.entity';

declare global {
  export interface AccessTokenPayload {
    id: string;
    role: EUserRole;
    jti: string;
    iat?: number;
    exp?: number;
  }
  namespace Express {
    export interface Request {
      user: AccessTokenPayload;
    }
  }
}
