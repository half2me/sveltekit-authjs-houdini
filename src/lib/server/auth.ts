import type { TokenSet } from '@auth/core/types';
import { SvelteKitAuth } from '@auth/sveltekit';
import Cognito from '@auth/core/providers/cognito';
import {
	AUTH_SECRET,
	AWS_COGNITO_USER_POOL_ID,
	AWS_COGNITO_USER_POOL_CLIENT_ID,
	AWS_COGNITO_USER_POOL_CLIENT_SECRET,
	AWS_COGNITO_DOMAIN
} from '$env/static/private';

import { PUBLIC_AWS_REGION } from '$env/static/public';

const issuer = `https://cognito-idp.${PUBLIC_AWS_REGION}.amazonaws.com/${AWS_COGNITO_USER_POOL_ID}`;
export const handle = SvelteKitAuth({
	secret: AUTH_SECRET,
	trustHost: true,
	providers: [
		Cognito({
			issuer,
			clientId: AWS_COGNITO_USER_POOL_CLIENT_ID,
			clientSecret: AWS_COGNITO_USER_POOL_CLIENT_SECRET
		}) as any
	],
	callbacks: {
		async jwt({ token, account, profile, isNewUser, user }) {
			if (account) {
				// Save the access token and refresh token in the JWT on the initial login
				return {
					access_token: account.access_token,
					expires_at: Date.now() + account.expires_in! * 1000, // TODO: store as ISODatestring
					refresh_token: account.refresh_token,
					user: {
						id: profile?.sub,
						email: profile?.email,
						email_verified: profile?.email_verified,
						groups: profile?.['cognito:groups'] ?? []
					}
				};
			} else if (Date.now() < token.expires_at!) {
				// If the access token has not expired yet, return it
				return token;
			} else {
				// If the access token has expired, try to refresh it
				try {
					const response = await fetch(
						`https://${AWS_COGNITO_DOMAIN}.auth.${PUBLIC_AWS_REGION}.amazoncognito.com/oauth2/token`,
						{
							headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
							body: new URLSearchParams({
								client_id: AWS_COGNITO_USER_POOL_CLIENT_ID,
								client_secret: AWS_COGNITO_USER_POOL_CLIENT_SECRET,
								grant_type: 'refresh_token',
								refresh_token: token.refresh_token as string
							}),
							method: 'POST'
						}
					);

					const tokens: TokenSet = await response.json();

					if (!response.ok) throw tokens;

					return {
						...token, // Keep the previous token properties
						access_token: tokens.access_token,
						expires_at: Date.now() + tokens.expires_in! * 1000,
						refresh_token: tokens.refresh_token ?? token.refresh_token
					};
				} catch (error) {
					console.error('Error refreshing access token', error);
					// The error property will be used client-side to handle the refresh token error
					return { ...token, error: 'RefreshAccessTokenError' as const };
				}
			}
		},
		async session({ token }) {
			const { access_token, user, expires_at } = token;

			return {
				access_token,
				user,
				expires_at
			};
		}
	}
});
