import { ZTrimString } from '@/modules/common/model/string.model';
import { z } from 'zod';

export const ZLogin = z.object({
  username: ZTrimString.min(5).max(30),
  password: z.string().min(6).max(30),
});

export type TLogin = z.infer<typeof ZLogin>;
