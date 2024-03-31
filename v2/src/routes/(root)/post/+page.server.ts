import { prisma } from '@//server/prisma';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const posts = await prisma.post.findMany({
		select: {
			id: true,
			title: true,
			cover: true,
			updatedAt: true
		},
		orderBy: {
			updatedAt: 'desc'
		}
	});
	return { posts };
}) satisfies PageServerLoad;
