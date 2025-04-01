import { z } from 'zod';

export const ZPermission = z.object({
  id: z.string().max(50),
  name: z.string().max(255),
  description: z.string().max(500).nullable().default(null),
  active: z.boolean().default(true),
});

export type TPermission = z.infer<typeof ZPermission>;
