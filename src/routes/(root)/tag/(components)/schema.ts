import { z } from 'zod';

export const tagFormSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    photo: z.string().optional(),
});

export type TagFormSchema = typeof tagFormSchema