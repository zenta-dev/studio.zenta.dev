import { prisma } from "@//server/prisma";
import type { LayoutServerLoad } from "./$types";

export const load = (async () => {
  const tags = await prisma.tag.findMany();
  return {
    tags,
  };
}) satisfies LayoutServerLoad;
