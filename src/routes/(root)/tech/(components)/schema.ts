import { z } from 'zod';

export const techFounderFormSchema = z.object({
    name: z.string(),
    type: z.enum(['PERSON', 'COMPANY', 'ORGANIZATION']),
    url: z.string().url(),
    photo: z.string().optional(),
})

export const techVersionFormSchema = z.object({
    whatNews: z.string().optional(),
    version: z.number(),
    description: z.string().optional(),
    url: z.string().url().optional(),
})

export const techFormSchema = z.object({
    name: z.string(),
    description: z.string(),
    logo: z.string(),
    url: z.string().url(),
    homepage: z.string().url().nullable(),
    founder: techFounderFormSchema,
})

export type TechFormSchema = typeof techFormSchema
export type TechFounderFormSchema = typeof techFounderFormSchema
export type TechVersionFormSchema = typeof techVersionFormSchema
