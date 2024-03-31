import { lucia } from "@//server/auth";
import { prisma } from "@//server/prisma";
import type { RequestHandler } from "./$types";

export const DELETE: RequestHandler = async ({ params, locals }) => {
  try {
    const sesId = locals.session?.id;
    if (!sesId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "You need to be logged in to delete a post",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
    const valid = lucia.validateSession(sesId);
    if (!valid) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "You need to be logged in to delete a post",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const { id } = params;

    if (!id) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "You need to provide an id to delete a post",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    await prisma.post.delete({
      where: {
        id,
      },
    });

    return new Response(
      JSON.stringify({ success: true, message: "Post deleted" }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "An error occurred" }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
