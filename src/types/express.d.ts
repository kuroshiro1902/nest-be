import { TUserJWTPayload } from '@/auth/models/user-jwt-payload.model';

declare global {
  declare namespace Express {
    export interface Request {
      user?: TUserJWTPayload;
    }
  }
}
