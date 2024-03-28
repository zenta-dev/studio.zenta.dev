import { prisma } from "@//server/prisma";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { tagFormSchema } from "../(components)/schema";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const { id } = params;
  const tag: any = await prisma.tag.findUnique({
    where: { id },
  });
  if (!tag) return { status: 404 };

  const form = await superValidate(tag, zod(tagFormSchema));

  return { tag };
}) satisfies PageServerLoad;
