import { authenticate } from '@//server/auth';
import { prisma } from '@//server/prisma';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params, locals, fetch }) => {
	try {
		authenticate(locals);

		const { id } = params;

		if (!id) {
			return new Response(
				JSON.stringify({
					success: false,
					message: 'You need to provide an id to delete a post'
				}),
				{
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
		}

		const d = await prisma.post.delete({
			where: {
				id
			}
		});

		await fetch('/api/image/delete', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				url: d.cover
			})
		});

		return new Response(JSON.stringify({ success: true, message: 'Post deleted' }), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify({ success: false, message: 'An error occurred' }), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};
