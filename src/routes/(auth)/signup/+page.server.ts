import { INVITE_MODE, SALT_ROUNDS } from "$env/static/private";
import { lucia } from "@//server/auth";
import { prisma } from "@//server/prisma";
import { error, fail } from "@sveltejs/kit";
import bcrypt from "bcrypt";
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

    const isInviteMode = INVITE_MODE === "true";
    if (isInviteMode) {
      if (data.pin === undefined || data.pin === "") {
        error(401, {
          message: `Pin is required.`,
          description: `Please enter the pin you received.`,
        });
      } else {
        const find = await prisma.invitation.findUnique({
          where: {
            email: data.email,
          },
        });
        if (!find || find.pin !== parseInt(data.pin)) {
          error(401, {
            message: `Invalid Pin.`,
            description: `The pin you entered is invalid.`,
          });
        }
      }
    }

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

    const hash = await bcrypt.hash(
      data.password,
      parseInt(SALT_ROUNDS ?? "10"),
    );

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
