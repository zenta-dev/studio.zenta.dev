import { prisma } from '@//server/prisma';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ setHeaders }) => {
	setHeaders({
		'Cache-Control': 'public, max-age=60, s-maxage=60'
	});

	const tags = await prisma.tech.findMany({
		select: {
			id: true,
			name: true,
			logo: true,
			createdAt: true
		}
	});

	return new Response(
		JSON.stringify({
			success: true,
			message: 'Successfully fetched tags',
			tags
		}),
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
};
