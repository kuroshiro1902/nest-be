import { User } from '@/modules/user/entity/user.entity';

export type TAccessTokenPayload = Pick<User, 'id' | 'role'>;
