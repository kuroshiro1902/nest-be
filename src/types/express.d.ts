import { TUserJWTPayload } from '@/auth/models/auth.model';

declare global {
  declare namespace Express {
    export interface Request {
      user?: TUserJWTPayload;
    }
  }
}
