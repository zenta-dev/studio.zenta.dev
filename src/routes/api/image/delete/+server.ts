import {
	CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET,
	VITE_PUBLIC_CLOUDINARY_CLOUD_NAME
} from '$env/static/private';
import { json } from '@sveltejs/kit';
import crypto from 'crypto';
import type { RequestHandler } from './$types';

function generateSignature(publicId: string, timestamp: number) {
	const secret = CLOUDINARY_API_SECRET;
	console.log('secret', secret);

	const sort = `public_id=${publicId}&timestamp=${timestamp}${secret}`;
	console.log('sort', sort);

	const signature = crypto.createHash('sha1').update(sort).digest('hex');
	console.log('signature', signature);

	return signature;
}

function urlToPublicId(url: string) {
	const parts = url.split('/');
	const publicId = parts[parts.length - 1].split('.')[0];
	return publicId;
}

export const POST = (async ({ request }) => {
	const body = await request.json();
	let { public_id, url } = body;
	const timestamp = Math.floor(Date.now() / 1000);
	let signature;
	if (!public_id) {
		public_id = urlToPublicId(url);
		console.log('publicId', public_id);
		signature = generateSignature(public_id, timestamp);
	} else {
		signature = generateSignature(public_id, timestamp);
	}
	console.log('signature', signature);
	const res = await fetch(
		`https://api.cloudinary.com/v1_1/${VITE_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				public_id,
				signature,
				api_key: CLOUDINARY_API_KEY,
				timestamp
			})
		}
	);
	const data = await res.json();
	return json(data);
}) satisfies RequestHandler;
