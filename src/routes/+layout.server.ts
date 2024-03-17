import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";


export const load = (async ({ locals, url }) => {
  const isSignUpUrl = url.pathname === "/signup";
  const isSignInUrl = url.pathname === "/signin";
  if (!locals.user || !locals.session) {
    if (isSignUpUrl || isSignInUrl) {
      return;
    } else {
      return redirect(302, "/signin");
    }
  }

  return {
    user: locals.user,
  };
}) satisfies LayoutServerLoad;
