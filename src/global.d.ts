import { User } from '@/modules/user/entity/user.entity';

declare global {
  namespace Express {
    export interface Request {
      user: Pick<User, 'id'>;
    }
  }
}
