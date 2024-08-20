import Keycloak from '@auth/core/providers/keycloak'
import { decodeJwt } from 'jose';

export default generateConfig({
	clientId: import.meta.env?.CLIENT_ID,
	clientSecret: import.meta.env?.CLIENT_SECRET,
	issuer: import.meta.env?.KEYCLOAK_ISSUER
})

export function generateConfig({
	clientId,
	clientSecret,
	issuer
}) {
	return {
		prefix: '/auth',
    injectEndpoints: false,
		providers: [
			Keycloak({
				clientId,
				clientSecret,
				issuer,
				authorization: {
					params: {
					  scope: "openid email profile roles",
					},
				  },
			})
		],
		callbacks: {
			async jwt({ token, account, profile }) {
				// Persist the OAuth access_token and or the user id to the token right after signin
				if (account) {
					token.access_token = account.access_token;
					token.refresh_token = account.refresh_token;
					token.id_token = account.id_token;
					return token;
				}
				if (!token.refresh_token || !token.id_token || !token.access_token) {
					return {};
				}
				return token;
			  },
			  async session(args) {
				const { session, token } = args;
				if (!token.access_token || !token.refresh_token || !token.id_token) {
					return { ...refreshAccessTokenError, expires: session.expires };
				}

				const unsafeDecodedAccessToken = decodeJwt(token.access_token);
	
				return {
					expires: session.expires,
					user: {
						id: unsafeDecodedAccessToken?.sub ?? '',
						name: unsafeDecodedAccessToken?.name,
						email: unsafeDecodedAccessToken?.email,
						roles: unsafeDecodedAccessToken?.roles,
						username: unsafeDecodedAccessToken?.preferred_username ?? ''
					},
					access_token: token.access_token,
					refresh_token: token.refresh_token,
					error: token.error
				};
			}
		// async signIn({ profile }) {
		//    // Only allow sign in for users with email addresses ending with "yourdomain.com"
		//    return profile?.email?.endsWith("@gmail.com")
		//  }
	}
}
}
