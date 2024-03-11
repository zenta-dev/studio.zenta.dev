import type { Handle } from "@sveltejs/kit";
import { lucia } from "./lib/server/auth";

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
};