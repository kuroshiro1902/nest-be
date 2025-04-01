import { ZUser } from '@/user/models/user.model';
import { z } from 'zod';

export const ZUserLogin = ZUser.pick({ email: true, password: true });

export const ZRefreshToken = z.string().max(255).optional();

export type TUserLogin = z.input<typeof ZUserLogin>;
export type TRefreshToken = z.input<typeof ZRefreshToken>;
