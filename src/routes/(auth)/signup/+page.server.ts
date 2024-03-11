import { SALT_ROUNDS } from "$env/static/private";
import { lucia } from "@//server/auth";
import { prisma } from "@//server/prisma";
import { error, fail } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";
import { signUpSchema } from "./(components)/schema";

export const load = (async () => {
  return {
    form: await superValidate(zod(signUpSchema)),
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(signUpSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }
    const { data } = form;

    if (data.password !== data.confirmPassword) {
      error(401, {
        message: `Password doesn't match.`,
        description: `Please make sure your password and confirm password match.`,
      });
    }

    const find = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (find) {
      error(401, {
        message: `Email already exists.`,
        description: `The email you entered already exists.`,
      });
    }

    const hash = await Bun.password.hash(data.password, {
      algorithm: "bcrypt",
      cost: parseInt(SALT_ROUNDS || "10"),
    });

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hash,
      },
    });

    const session = await lucia.createSession(user.id, {});

    const cookie = lucia.createSessionCookie(session.id);

    event.cookies.set(cookie.name, cookie.value, {
      path: ".",
      ...cookie.attributes,
    });

    return message(form, {
      message: "Congratulations!",
      description: "You have successfully signed up.",
    });
  },
};
