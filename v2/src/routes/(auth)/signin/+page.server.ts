import { lucia } from '@//server/auth';
import { prisma } from '@//server/prisma';
import { fail } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const signInSchema = z.object({
	email: z
		.string({
			required_error: 'Email is required'
		})
		.email({
			message: 'Invalid email address'
		}),
	password: z
		.string({
			required_error: 'Password is required'
		})
		.min(6, {
			message: 'Password must be at least 6 characters'
		})
});

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(signInSchema));
	return { form };
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(signInSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { data } = form;

		const find = await prisma.user.findUnique({
			where: {
				email: data.email
			}
		});

		if (!find) {
			return fail(400, {
				form,
				success: false,
				message: 'Invalid credentials.',
				description: 'The email or password you entered is incorrect.'
			});
		}

		const match = await bcrypt.compare(data.password, find.password);

		if (!match) {
			return fail(400, {
				form,
				success: false,
				message: 'Invalid credentials.',
				description: 'The email or password you entered is incorrect.'
			});
		}

		const session = await lucia.createSession(find.id, {});

		const cookie = lucia.createSessionCookie(session.id);

		event.locals.user = find;
		event.locals.session = session;

		event.cookies.set(cookie.name, cookie.value, {
			path: '.',
			...cookie.attributes
		});

		return message(form, {
			success: true,
			message: 'Logged in successfully.',
			description: "We're redirecting you to your dashboard."
		});
	}
};
