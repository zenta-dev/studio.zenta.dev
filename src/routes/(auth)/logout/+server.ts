import { lucia } from "@//server/auth";
import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ locals }) => {
  const ses = await lucia.validateSession(locals.session?.id || "");
  if (ses) {
    await lucia.invalidateSession(locals.session?.id || "");
    await lucia.deleteExpiredSessions();
  }
  // return new Response(
  //   JSON.stringify({
  //     message: "You have successfully logged out.",
  //     description: "You have successfully logged out.",
  //   }),
  //   {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   },
  // );
  redirect(302, "/");
};
