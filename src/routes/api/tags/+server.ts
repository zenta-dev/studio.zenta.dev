import { prisma } from "@//server/prisma";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  const tags = await prisma.tag.findMany();

  return new Response(JSON.stringify(tags), {
    headers: {
      "content-type": "application/json",
    },
  });
};
