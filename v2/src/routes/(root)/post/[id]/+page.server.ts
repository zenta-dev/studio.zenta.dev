import { prisma } from '@//server/prisma';
import type { Prisma } from '@prisma/client';
import { error, fail, type Actions } from '@sveltejs/kit';
import type { JSONContent } from '@tiptap/core';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

const json: z.ZodType<JSONContent | Prisma.JsonValue> = z.lazy(() =>
	z.object({
		type: z.string().min(2).optional(),
		attrs: z.record(z.string(), z.any()).optional(),
		content: z.array(json).optional(),
		marks: z
			.array(
				z.object({
					type: z.string(),
					attrs: z.record(z.string(), z.any()).optional()
				})
			)
			.optional(),
		text: z.string().optional()
	})
);

const postFormSchema = z.object({
	id: z.string().optional(),
	title: z.string().min(10),
	cover: z
		.string({
			required_error: `Please provide a cover image for the post.`
		})
		.url({
			message: `Please provide a valid URL for the cover image.`
		}),
	summary: z.string().min(10),
	// published: z.boolean(),
	content: json,
	authors: z
		.array(
			z.object({
				id: z.string().min(10)
			})
		)
		.nonempty({
			message: `Please select at least one author.`
		}),
	tags: z
		.array(
			z.object({
				id: z.string().min(10)
			})
		)
		.nonempty({
			message: `Please select at least one tag.`
		}),
	stacks: z
		.array(
			z.object({
				id: z.string().min(10)
			})
		)
		.nonempty({
			message: `Please select at least one stack.`
		})
});

export const load = (async ({ params, url }) => {
	const p = url.searchParams;
	const tag = p.get('tag') === 'true';
	const tech = p.get('tech') === 'true';
	let tags, stacks;

	if (!tag) {
		tags = await prisma.tag.findMany({
			select: {
				id: true,
				name: true,
				photo: true
			}
		});
	}

	if (!tech) {
		stacks = await prisma.tech.findMany({
			select: {
				id: true,
				name: true,
				logo: true
			}
		});
	}

	const { id } = params;
	const users = await prisma.user.findMany({
		where: {
			email: {
				not: 'zenta@seeder.com'
			},
			role: 'ADMIN'
		},
		select: {
			id: true,
			name: true,
			photo: true
		}
	});
	if (id == 'new') {
		const form = await superValidate(zod(postFormSchema));
		return { form, users, tags, stacks };
	}

	const post =
		(await prisma.post.findUnique({
			where: {
				id
			},
			select: {
				id: true,
				title: true,
				cover: true,
				published: true,
				content: true,
				summary: true,
				updatedAt: true,
				authors: {
					select: {
						id: true
					}
				},
				tags: {
					select: {
						id: true
					}
				},
				stacks: {
					select: {
						id: true
					}
				}
			}
		})) || {};

	const form = await superValidate(post, zod(postFormSchema));
	return { form, users, tags, stacks };
}) satisfies PageServerLoad;

export const actions: Actions = {
	create: async (event) => {
		try {
			const form = await superValidate(event, zod(postFormSchema));

			if (!form.valid) {
				console.log('FAIL REASON: ', form.errors);
				const { data } = form;
				const authors = data.authors;
				const tags = data.tags;
				const stacks = data.stacks;
				const lastAuthor = authors[authors.length - 1];
				const lastTag = tags[tags.length - 1];
				const lastStack = stacks[stacks.length - 1];

				if (tags.length == 0 && lastTag.id === '') {
					return fail(400, {
						form
					});
				} else if (tags.length > 0 && lastTag.id === '') {
					tags.pop();
				}

				if (authors.length == 0 && lastAuthor.id === '') {
					return fail(400, {
						form
					});
				} else if (authors.length > 0 && lastAuthor.id === '') {
					authors.pop();
				}

				if (stacks.length == 0 && lastStack.id === '') {
					return fail(400, {
						form
					});
				} else if (stacks.length > 0 && lastStack.id === '') {
					stacks.pop();
				}
			}

			const { data } = form;

			console.log('DATA: ', data);

			const find = await prisma.post.findUnique({
				where: {
					slug: data.title.toLowerCase().replace(/\s/g, '-')
				}
			});

			if (find) {
				error(400, {
					message: `Slug already exists.`,
					description: `Please choose a different slug.`
				});
			}

			await prisma.post.create({
				data: {
					title: data.title,
					slug: data.title.toLowerCase().replace(/\s/g, '-'),
					published: true,
					summary: data.summary,
					authors: {
						connect: data.authors.map((author) => ({ id: author.id }))
					},
					tags: {
						connect: data.tags.map((tag) => ({ id: tag.id }))
					},
					stacks: {
						connect: data.stacks.map((stack) => ({ id: stack.id }))
					},
					cover: data.cover,
					content: data.content as JSONContent
				}
			});

			return message(form, {
				success: true,
				message: `Post created successfully.`,
				description: `The post has been created successfully.`
			});
		} catch (error) {
			console.error(error);
			return fail(400, {
				error
			});
		}
	},
	update: async (event) => {
		const form = await superValidate(event, zod(postFormSchema));

		if (!form.valid) {
			console.log('FAIL REASON: ', form.errors);
			return fail(400, {
				form
			});
		}

		const { data } = form;

		console.log('DATA: ', data);

		await prisma.post.update({
			where: {
				id: data.id
			},
			data: {
				title: data.title,
				slug: data.title.toLowerCase().replace(/\s/g, '-'),
				published: true,
				summary: data.summary,
				authors: {
					set: data.authors.map((author) => ({ id: author.id }))
				},
				tags: {
					set: data.tags.map((tag) => ({ id: tag.id }))
				},
				stacks: {
					set: data.stacks.map((stack) => ({ id: stack.id }))
				},
				cover: data.cover,
				content: data.content as JSONContent
			}
		});

		return message(form, {
			success: true,
			message: `Post updated successfully.`,
			description: `The post has been updated successfully.`
		});
	}
};
