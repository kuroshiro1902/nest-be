import { z } from 'zod';

export const UpdateMenuItemDto = z.object({
  label: z.string().trim().max(255).optional(),
  path: z.string().trim().max(255).nullable().optional(),
  icon: z.string().trim().max(255).nullable().optional(),
  order: z.number().int().min(0).max(1000).optional(),
});

export type UpdateMenuItemDto = z.infer<typeof UpdateMenuItemDto>;
