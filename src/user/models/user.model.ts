import { z } from 'zod';
import { ZPermission } from '@/permission/models/permission.model';
import { Prisma } from '@prisma/client';

export const ZUser = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(5).max(255),
  email: z.string().email().trim(),
  password: z.string().trim().min(6).max(255),
  avatarImg: z.string().max(500).nullable().default(null),
  bgImg: z.string().max(500).nullable().default(null),
  permissions: z.array(ZPermission).nullable().default([]),
});

export const ZUserCreate = ZUser.pick({
  name: true,
  email: true,
  password: true,
  avatarImg: true,
  bgImg: true,
});

export const UserDefaultSelect = {
  id: true,
  name: true,
  email: true,
  avatarImg: true,
  bgImg: true,
};

export const UserDefaultDTO = (
  user: Pick<TUser, 'id' | 'name' | 'email' | 'bgImg' | 'avatarImg'> &
    Record<string, any>,
) => {
  const { id, name, email, bgImg, avatarImg } = user;
  return { id, name, email, bgImg, avatarImg };
};

export type TUser = z.infer<typeof ZUser>;
export type TUserCreate = z.input<typeof ZUserCreate>;
export type TUserSelect = Prisma.UserSelect;
