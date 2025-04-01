import { ZodError } from 'zod';

export const errorMessage = (error: ZodError | Error) => {
  if (error instanceof ZodError) {
    return error.errors
      .map((err) => {
        return `Field: ${err.path.join('.')}, Error: ${err.message}`;
      })
      .join('; ');
  } else {
    return error.message ?? 'An error occurred!';
  }
};
