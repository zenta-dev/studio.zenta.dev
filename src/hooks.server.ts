import type { Handle } from '@sveltejs/kit';
import { lucia } from './lib/server/auth';
import { prisma } from './lib/server/prisma';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	let user = null;
	let session = null;

	if (sessionId) {
		const { session: validatedSession, user: validatedUser } =
			await lucia.validateSession(sessionId);

		if (validatedSession) {
			const find = await prisma.session.findUnique({
				where: { id: validatedSession.id }
			});

			if (find) {
				const now = new Date();
				const expired = new Date(validatedSession.expiresAt);

				if (now <= expired) {
					if (validatedSession.fresh) {
						const cookie = lucia.createSessionCookie(validatedSession.id);
						event.cookies.set(cookie.name, cookie.value, {
							path: '.',
							...cookie.attributes
						});
					}

					user = validatedUser;
					session = validatedSession;
				} else {
					await prisma.session.delete({
						where: {
							id: validatedSession.id,
							userId: validatedSession.userId
						}
					});
				}
			}
		}
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};
