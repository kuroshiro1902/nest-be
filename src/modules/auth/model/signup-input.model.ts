import { ZTrimString } from '@/modules/common/model/string.model';
import { z } from 'zod';
import dayjs from 'dayjs';

export const ZSignupInput = z.object({
  name: ZTrimString.min(5).max(255),
  username: ZTrimString.min(5).max(30),
  password: z.string().min(6).max(30),
  email: ZTrimString.min(1).max(255).email().optional(),
  dob: z
    .string()
    .length(10)
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Định dạng ngày không hợp lệ (YYYY-MM-DD).' })
    .refine((val) => dayjs(val, 'YYYY-MM-DD', true).isValid(), {
      message: 'Ngày tháng không hợp lệ.',
    })
    .refine((val) => dayjs(val).isBefore(dayjs()) && dayjs(val).isAfter(dayjs('1920-01-01', 'YYYY-MM-DD')), {
      message: 'Ngày sinh phải trong trong khoảng từ 01/01/1920 đến hiện tại.',
    })
    .optional(),
  description: ZTrimString.max(5000).optional(),
  avatarUrl: ZTrimString.max(1000).optional(),
  bgImgUrl: ZTrimString.max(1000).optional(),
});

export type TSignupInput = z.infer<typeof ZSignupInput>;
