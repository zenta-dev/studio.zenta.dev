import { prisma } from '@//server/prisma';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    const tags = await prisma.tag.findMany();
    return {
        tags,
    };
}) satisfies PageServerLoad;