import { dev } from '$app/environment';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { GitHub } from 'arctic';
import { Lucia, TimeSpan } from 'lucia';
import { prisma } from './prisma';

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
	getUserAttributes: (attributes) => {
		return {
			name: attributes.name,
			email: attributes.email,
			githubId: attributes.github_id,
			username: attributes.username
		};
	},
	sessionExpiresIn: new TimeSpan(30, 'd'),
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	name: string;
	email: string;
	github_id: number;
	username: string;
}

export const github = new GitHub(
	import.meta.env.GITHUB_CLIENT_ID,
	import.meta.env.GITHUB_CLIENT_SECRET
);

export function authenticate(locals: App.Locals) {
	const sesId = locals.session?.id;
	if (!sesId) {
		return new Response(
			JSON.stringify({
				success: false,
				message: 'You need to be logged in to delete a post'
			}),
			{
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}
	const valid = lucia.validateSession(sesId);
	if (!valid) {
		return new Response(
			JSON.stringify({
				success: false,
				message: 'You need to be logged in to delete a post'
			}),
			{
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}
}
