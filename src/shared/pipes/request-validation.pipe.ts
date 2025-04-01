import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodSchema, infer as ZodInfer, ZodError } from 'zod';

export class RequestValidationPipe<T extends ZodSchema<unknown> = ZodSchema>
  implements PipeTransform
{
  constructor(private schema: T) {}

  transform(value: unknown): ZodInfer<T> {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException(this.errorMessage(result.error));
    }
    return result.data;
  }

  private errorMessage = (error: ZodError | Error) => {
    if (error instanceof ZodError) {
      return error.errors
        .map((err) => {
          const field = err.path.length > 0 ? err.path.join('.') : 'Invalid field!';
          const message = err.message || 'Unknown validation error';
          return `Field: ${field}, Error: ${message}`;
        })
        .join('; ');
    } else {
      return error.message ?? 'An error occurred when validate!';
    }
  };
}
