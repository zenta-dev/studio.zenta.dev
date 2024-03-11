import type { Handle } from "@sveltejs/kit";
import { lucia } from "./lib/server/auth";
import { prisma } from "./lib/server/prisma";

export const handle: Handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get(lucia.sessionCookieName);
  if (!sessionId) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (!session) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const find = await prisma.session.findUnique({
    where: {
      id: session.id,
    },
  });
  if (!find) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  } else {
    const now = new Date();
    const expired = new Date(session.expiresAt);
    if (now > expired) {
      await prisma.session.delete({
        where: {
          id: session.id,
          userId: session.userId
        },
      });
      event.locals.user = null;
      event.locals.session = null;
      return resolve(event);
    } else {
      if (session && session.fresh) {
        const cookie = lucia.createSessionCookie(session.id);
        event.cookies.set(cookie.name, cookie.value, {
          path: ".",
          ...cookie.attributes,
        });
      }
      event.locals.user = user;
      event.locals.session = session;
      return resolve(event);
    }
  }

};
