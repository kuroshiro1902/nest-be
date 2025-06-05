import { z } from 'zod';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const SignupDto = z
  .object({
    name: z.string().trim().min(5).max(255),
    username: z.string().trim().min(5).max(30),
    password: z.string().min(6).max(30),
    confirmPassword: z.string().min(6).max(30),
    email: z.string().trim().min(1).max(255).email().optional(),
    dob: z.union([
      z.undefined(),
      z
        .string()
        .length(10)
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Định dạng ngày không hợp lệ (YYYY-MM-DD).' })
        .refine((val) => dayjs(val, 'YYYY-MM-DD', true).isValid(), {
          message: 'Ngày tháng không hợp lệ.',
        })
        .refine(
          (val) => {
            const date = dayjs(val, 'YYYY-MM-DD', true);
            return date.isValid() && date.isBefore(dayjs()) && date.isAfter(dayjs('1920-01-01'));
          },
          {
            message: 'Ngày sinh phải trong trong khoảng từ 01/01/1920 đến hiện tại.',
          },
        ),
    ]),
    description: z.string().trim().max(5000).optional(),
    avatarUrl: z.string().trim().max(1000).optional(),
    bgUrl: z.string().trim().max(1000).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu và mật khẩu xác nhận không khớp.',
    path: ['confirmPassword'],
  });

export type SignupDto = z.infer<typeof SignupDto>;
