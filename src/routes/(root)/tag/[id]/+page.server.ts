import { prisma } from '@//server/prisma';
import { error, fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

const tagFormSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	description: z.string().optional(),
	photo: z.string()
});

export const load = (async ({ params }) => {
	const { id } = params;
	if (id == 'new') {
		const form = await superValidate(zod(tagFormSchema));
		return { form };
	}

	const tag =
		(await prisma.tag.findUnique({
			where: {
				id
			},
			select: {
				id: true,
				name: true,
				description: true,
				photo: true
			}
		})) || {};

	const form = await superValidate(tag, zod(tagFormSchema));
	return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
	create: async (event) => {
		try {
			const form = await superValidate(event, zod(tagFormSchema));

			const { data } = form;
			console.log('DATA: ', data);

			if (!form.valid) {
				console.log('FAIL REASON: ', form.errors);
				return fail(400, {
					form
				});
			}

			const find = await prisma.tag.findUnique({
				where: {
					name: data.name
				}
			});

			if (find) {
				error(400, {
					message: `Tag name already exists.`,
					description: `Please choose a different tag name.`
				});
			}

			await prisma.tag.create({
				data: {
					name: data.name,
					description: data.description,
					photo: data.photo
				}
			});

			return message(form, {
				success: true,
				message: `Tag created successfully.`,
				description: `The tag has been created successfully.`
			});
		} catch (error) {
			console.error(error);
			return fail(400, {
				error
			});
		}
	},
	update: async (event) => {
		const form = await superValidate(event, zod(tagFormSchema));

		if (!form.valid) {
			console.log('FAIL REASON: ', form.errors);
			return fail(400, {
				form
			});
		}

		const { data } = form;

		console.log('DATA: ', data);

		await prisma.tag.update({
			where: {
				id: data.id
			},
			data: {
				name: data.name,
				description: data.description,
				photo: data.photo
			}
		});

		return message(form, {
			success: true,
			message: `Tag updated successfully.`,
			description: `The tag has been updated successfully.`
		});
	}
};
