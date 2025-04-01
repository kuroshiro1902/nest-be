import { z } from 'zod';

export const Validator = {
  select: z
    .string()
    .max(1000)
    .transform(
      (val) =>
        val
          .split(',') // Chia chuỗi theo dấu phẩy
          .map((item) => item.trim()) // Loại bỏ khoảng trắng thừa
          .filter((item) => item !== '') // Loại bỏ các chuỗi rỗng
          .filter((value, index, self) => self.indexOf(value) === index), // Loại bỏ các phần tử trùng lặp
    )
    .refine((arr) => arr.every((item) => typeof item === 'string'), {
      message: 'Each field must be a string',
    }),
};
