import { lucia } from '@//server/auth';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
	const ses = await lucia.validateSession(locals.session?.id || '');
	if (ses) {
		await lucia.invalidateSession(locals.session?.id || '');
		await lucia.deleteExpiredSessions();
	}
	throw redirect(302, '/');
};
