import { prisma } from '@//server/prisma';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const tags = await prisma.tag.findMany({
		select: {
			id: true,
			name: true,
			photo: true,
			updatedAt: true
		}
	});
	return { tags };
}) satisfies PageServerLoad;
