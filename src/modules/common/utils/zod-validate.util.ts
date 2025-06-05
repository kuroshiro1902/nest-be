import { BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

export function zodValidate<T>(schema: ZodSchema<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    const firstError = result.error.errors[0];
    const field = firstError?.path?.join('.') || 'input';
    const message = firstError?.message || 'Validation failed';

    throw new BadRequestException(`${field}: ${message}`);
  }
  return result.data;
}
