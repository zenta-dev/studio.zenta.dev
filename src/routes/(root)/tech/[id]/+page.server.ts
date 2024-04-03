import { prisma } from '@//server/prisma';
import { error, fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

const techFounderFormSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	type: z.enum(['PERSON', 'COMPANY', 'ORGANIZATION']),
	url: z.string().url(),
	photo: z.string().optional()
});

const techVersionFormSchema = z.object({
	id: z.string().optional(),
	version: z.any(),
	description: z.string().optional(),
	whatNews: z.string().optional(),
	hash: z.string().optional(),
	url: z.string().url().optional()
});

const techFormSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	description: z.string(),
	logo: z.string(),
	url: z.string().url(),
	homepage: z.string().url().nullable(),
	founder: techFounderFormSchema,
	versions: z.array(techVersionFormSchema)
});

export const load = (async ({ params }) => {
	const { id } = params;
	if (id == 'new') {
		const form = await superValidate(zod(techFormSchema));
		return { form };
	}

	const tech =
		(await prisma.tech.findUnique({
			where: {
				id
			},
			select: {
				id: true,
				name: true,
				description: true,
				logo: true,
				url: true,
				homepage: true,
				updatedAt: true,
				versions: {
					select: {
						id: true,
						version: true,
						description: true,
						whatNews: true,
						hash: true
					}
				},
				founder: {
					select: {
						id: true,
						name: true,
						type: true,
						url: true,
						photo: true
					}
				}
			}
		})) || {};

	const form = await superValidate(tech, zod(techFormSchema));
	return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
	create: async (event) => {
		try {
			const form = await superValidate(event, zod(techFormSchema));

			const { data } = form;
			console.log('DATA: ', data);

			if (!form.valid) {
				const versions = data.versions;
				const lastVersion = versions[versions.length - 1];
				console.log('FAIL REASON: ', form.errors);
				if (versions.length == 0 && lastVersion.id === '') {
					return fail(400, {
						form
					});
				} else if (versions.length > 0 && lastVersion.id === '') {
					versions.pop();
				}
			}

			const find = await prisma.tech.findUnique({
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

			await prisma.tech.create({
				data: {
					name: data.name,
					description: data.description,
					logo: data.logo,
					url: data.url,
					homepage: data.homepage,
					founder: {
						connectOrCreate: {
							where: {
								id: data.founder.id || 'undefined'
							},
							create: {
								name: data.founder.name,
								type: data.founder.type,
								url: data.founder.url,
								photo: data.founder.photo
							}
						}
					},
					versions: {
						connectOrCreate: data.versions.map((version) => ({
							where: {
								id: version.id || 'undefined'
							},
							create: {
								version: parseFloat(version.version),
								description: version.description,
								whatNews: version.whatNews,
								hash: version.hash || data.name + version.version,
								url: version.url
							}
						}))
					}
				}
			});

			return message(form, {
				success: true,
				message: `Tech created successfully.`,
				description: `The tech has been created successfully.`
			});
		} catch (error) {
			console.error(error);
			return fail(400, {
				error
			});
		}
	},
	update: async (event) => {
		const form = await superValidate(event, zod(techFormSchema));

		if (!form.valid) {
			console.log('FAIL REASON: ', JSON.stringify(form.errors));
			return fail(400, {
				form
			});
		}

		const { data } = form;

		console.log('DATA: ', data);

		await prisma.tech.update({
			where: {
				id: data.id
			},
			data: {
				name: data.name,
				description: data.description,
				logo: data.logo,
				url: data.url,
				homepage: data.homepage,
				founder: {
					update: {
						name: data.founder.name,
						type: data.founder.type,
						url: data.founder.url,
						photo: data.founder.photo
					}
				},
				versions: {
					upsert: data.versions.map((version) => ({
						where: {
							id: version.id || 'undefined'
						},
						create: {
							version: parseFloat(version.version),
							description: version.description,
							whatNews: version.whatNews,
							hash: version.hash || data.name + version.version,
							url: version.url
						},
						update: {
							version: parseFloat(version.version),
							description: version.description,
							whatNews: version.whatNews,
							hash: version.hash || data.name + version.version,
							url: version.url
						}
					}))
				}
			}
		});

		return message(form, {
			success: true,
			message: `Tech updated successfully.`,
			description: `The tech has been updated successfully.`
		});
	}
};
