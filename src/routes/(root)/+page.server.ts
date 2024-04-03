import { prisma } from '@//server/prisma';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const postCount = await prisma.post.count();
	const tagCount = await prisma.tag.count();
	const techCount = await prisma.tech.count();

	return {
		postCount,
		tagCount,
		techCount
	};
}) satisfies PageServerLoad;
