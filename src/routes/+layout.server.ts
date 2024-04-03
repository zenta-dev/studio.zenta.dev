import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
	const isSignUpUrl = url.pathname === '/signup';
	const isSignInUrl = url.pathname === '/signin';
	if (isSignUpUrl || isSignInUrl) {
		return;
	}
	if (!locals.user || !locals.session) {
		return redirect(302, '/signin');
	}

	return {
		user: locals.user
	};
}) satisfies LayoutServerLoad;
