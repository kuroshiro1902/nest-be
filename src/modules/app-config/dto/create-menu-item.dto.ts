import { z } from 'zod';

export const CreateMenuItemDto = z.object({
  label: z.string().trim().max(255),
  path: z.string().trim().max(255).nullable().optional(),
  icon: z.string().trim().max(255).nullable().optional(),
  order: z.number().int().min(0).max(1000).default(0),
  parentId: z.string().uuid().nullable().optional(),
});

export type CreateMenuItemDto = z.infer<typeof CreateMenuItemDto>;
