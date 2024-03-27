import type { JSONContent } from "@tiptap/core";
import { z } from "zod";

const json: z.ZodType<JSONContent> = z.lazy(() =>
  z.object({
    type: z.string().min(2).optional(),
    attrs: z.record(z.string(), z.any()).optional(),
    content: z.array(json).optional(),
    marks: z
      .array(
        z.object({
          type: z.string(),
          attrs: z.record(z.string(), z.any()).optional(),
        }),
      )
      .optional(),
    text: z.string().optional(),
  }),
);

export const postFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(10),
  slug: z.string().min(10).optional(),
  published: z.boolean(),
  authors: z
    .array(
      z.object({
        id: z.string().min(10),
      }),
    )
    .nonempty(),
  tags: z
    .array(
      z.object({
        id: z.string().min(10),
      }),
    )
    .nonempty(),
  stacks: z
    .array(
      z.object({
        id: z.string().min(10),
      }),
    )
    .nonempty(),
  cover: z.string().min(10),
  content: json,
});

export type PostFormSchema = typeof postFormSchema;
