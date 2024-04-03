import {
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    VITE_PUBLIC_CLOUDINARY_CLOUD_NAME
} from '$env/static/private';
import { error, json } from '@sveltejs/kit';
import { v2 as cloudinary } from 'cloudinary';
import type { RequestHandler } from './$types';

export const POST = (async ({ request }) => {
	const body = await request.json();
	const { paramsToSign } = body;
	console.log('paramsToSign', paramsToSign);
	try {
		const signature = cloudinary.utils.sign_request(paramsToSign, {
			api_key: CLOUDINARY_API_KEY,
			api_secret: CLOUDINARY_API_SECRET,
			secure: true,
			cloud_name: VITE_PUBLIC_CLOUDINARY_CLOUD_NAME
		});

		return json({ signature });
	} catch (e: any) {
		return error(500, e.message);
	}
}) satisfies RequestHandler;
