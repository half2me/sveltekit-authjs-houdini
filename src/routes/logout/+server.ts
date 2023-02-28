import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { AWS_COGNITO_USER_POOL_CLIENT_ID, AWS_COGNITO_DOMAIN } from '$env/static/private';
import { PUBLIC_AWS_REGION } from '$env/static/public';

export const GET = (({ url }) => {
	const params = new URLSearchParams({
		client_id: AWS_COGNITO_USER_POOL_CLIENT_ID,
		logout_uri: url.origin + '/'
	});
	const logoutUrl = `https://${AWS_COGNITO_DOMAIN}.auth.${PUBLIC_AWS_REGION}.amazoncognito.com/logout?${params}`;
	console.log(logoutUrl);
	throw redirect(302, logoutUrl);
}) satisfies RequestHandler;
