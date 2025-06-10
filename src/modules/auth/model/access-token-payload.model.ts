import { User } from '@prisma/client';

export type TAccessTokenPayload = Pick<User, 'id'>;
