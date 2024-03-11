import { lucia } from "@//server/auth";
import { prisma } from "@//server/prisma";
import { error, fail } from "@sveltejs/kit";
import bcrypt from "bcrypt";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";
import { signInSchema } from "./(components)/schema";

export const load = (async () => {
  return {
    form: await superValidate(zod(signInSchema)),
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(signInSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    const { data } = form;

    const find = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!find) {
      error(401, {
        message: "Invalid credentials.",
        description: "The email or password you entered is incorrect.",
      });
    }

    const match = await bcrypt.compare(data.password, find.password);

    if (!match) {
      error(401, {
        message: "Invalid credentials.",
        description: "The email or password you entered is incorrect.",
      });
    }

    const session = await lucia.createSession(find.id, {});

    const cookie = lucia.createSessionCookie(session.id);

    event.locals.user = find;
    event.locals.session = session;

    event.cookies.set(cookie.name, cookie.value, {
      path: ".",
      ...cookie.attributes,
    });

    return message(form, {
      message: "Congratulations!",
      description: "You have successfully signed in.",
    });
  },
};
