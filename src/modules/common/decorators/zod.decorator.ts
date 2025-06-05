import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

/**
 * Decorator để validate body với Zod schema
 * @param schema Zod schema để validate
 * @returns Decorator function
 *
 * @example
 * ```typescript
 * @Post()
 * async create(@ZodBody(CreateUserDto) body: CreateUserDto) {
 *   return this.userService.create(body);
 * }
 * ```
 */
export const ZodBody = <T>(schema: ZodSchema<T>) => {
  return createParamDecorator((data: unknown, ctx: ExecutionContext): T => {
    const request = ctx.switchToHttp().getRequest();
    const body = request.body;

    const result = schema.safeParse(body);
    if (!result.success) {
      const firstError = result.error.errors[0];
      const field = firstError?.path?.join('.') || 'body';
      const message = firstError?.message || 'Validation failed';

      throw new BadRequestException(`${field}: ${message}`);
    }

    return result.data;
  })();
};

/**
 * Decorator để validate query parameters với Zod schema
 * @param schema Zod schema để validate
 * @returns Decorator function
 *
 * @example
 * ```typescript
 * @Get()
 * async findAll(@ZodQuery(SearchUserDto) query: SearchUserDto) {
 *   return this.userService.findAll(query);
 * }
 * ```
 */
export const ZodQuery = <T>(schema: ZodSchema<T>) => {
  return createParamDecorator((data: unknown, ctx: ExecutionContext): T => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    const result = schema.safeParse(query);
    if (!result.success) {
      const firstError = result.error.errors[0];
      const field = firstError?.path?.join('.') || 'query';
      const message = firstError?.message || 'Validation failed';

      throw new BadRequestException(`${field}: ${message}`);
    }

    return result.data;
  })();
};

/**
 * Decorator để validate route parameters với Zod schema
 * @param schema Zod schema để validate
 * @returns Decorator function
 *
 * @example
 * ```typescript
 * @Get(':id')
 * async findOne(@ZodParam(z.string().uuid()) params: { id: string }) {
 *   return this.userService.findOne(params.id);
 * }
 * ```
 */
export const ZodParam = <T>(schema: ZodSchema<T>) => {
  return createParamDecorator((data: unknown, ctx: ExecutionContext): T => {
    const request = ctx.switchToHttp().getRequest();
    const params = request.params;

    const result = schema.safeParse(params);
    if (!result.success) {
      const firstError = result.error.errors[0];
      const field = firstError?.path?.join('.') || 'params';
      const message = firstError?.message || 'Validation failed';

      throw new BadRequestException(`${field}: ${message}`);
    }

    return result.data;
  })();
};

/**
 * Decorator để validate headers với Zod schema
 * @param schema Zod schema để validate
 * @returns Decorator function
 *
 * @example
 * ```typescript
 * @Get()
 * async findAll(@ZodHeaders(z.object({ authorization: z.string() })) headers: { authorization: string }) {
 *   return this.userService.findAll();
 * }
 * ```
 */
export const ZodHeaders = <T>(schema: ZodSchema<T>) => {
  return createParamDecorator((data: unknown, ctx: ExecutionContext): T => {
    const request = ctx.switchToHttp().getRequest();
    const headers = request.headers;

    const result = schema.safeParse(headers);
    if (!result.success) {
      const firstError = result.error.errors[0];
      const field = firstError?.path?.join('.') || 'headers';
      const message = firstError?.message || 'Validation failed';

      throw new BadRequestException(`${field}: ${message}`);
    }

    return result.data;
  })();
};

/**
 * Decorator để validate tất cả input (body, query, params) với một schema duy nhất
 * @param schema Zod schema để validate
 * @returns Decorator function
 *
 * @example
 * ```typescript
 * @Post(':id')
 * async update(@ZodAll(UpdateUserDto) input: UpdateUserDto) {
 *   return this.userService.update(input);
 * }
 * ```
 */
export const ZodAll = <T>(schema: ZodSchema<T>) => {
  return createParamDecorator((data: unknown, ctx: ExecutionContext): T => {
    const request = ctx.switchToHttp().getRequest();
    const allData = {
      ...request.body,
      ...request.query,
      ...request.params,
    };

    const result = schema.safeParse(allData);
    if (!result.success) {
      const firstError = result.error.errors[0];
      const field = firstError?.path?.join('.') || 'input';
      const message = firstError?.message || 'Validation failed';

      throw new BadRequestException(`${field}: ${message}`);
    }

    return result.data;
  })();
};
