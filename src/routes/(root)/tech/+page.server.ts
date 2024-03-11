import { prisma } from "@//server/prisma";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const tech = await prisma.tech.findMany({
    include: {
      founder: true,
      versions: {
        orderBy: {
          version: "desc",
        },
      },
    },
  });
  return {
    tech,
  };
}) satisfies PageServerLoad;
