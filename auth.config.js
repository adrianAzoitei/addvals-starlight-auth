import Auth0 from '@auth/core/providers/auth0';
import { decodeJwt } from 'jose';

export default generateConfig({
	clientId: import.meta.env?.CLIENT_ID,
	clientSecret: import.meta.env?.CLIENT_SECRET,
	issuer: import.meta.env?.ISSUER,
	namespace: import.meta.env?.AUTH0_NAMESPACE,
	audience: import.meta.env?.AUTH0_AUDIENCE
})

export function generateConfig({
	clientId,
	clientSecret,
	issuer,
	namespace,
	audience
}) {
	return {
		prefix: '/auth',
    injectEndpoints: false,
		providers: [
			Auth0({
				clientId,
				clientSecret,
				issuer,
				authorization: {
					params: {
					  scope: `openid email profile`,
					  audience: audience
					},
				  },
			})
		],
		callbacks: {
			async jwt({ token, account, profile }) {
				// Persist the OAuth access_token and or the user id to the token right after signin
				if (account) {
					token.access_token = account.access_token;
					// token.refresh_token = account.refresh_token;
					token.id_token = account.id_token;
					return token;
				}
				// if (!token.refresh_token || !token.id_token || !token.access_token) {
				if (!token.id_token || !token.access_token) {
					return {};
				}
				return token;
			  },
			  async session(args) {
				const { session, token } = args;
				console.log("SESSION");
				// if (!token.access_token || !token.refresh_token || !token.id_token) {
				if (!token.access_token || !token.id_token) {
					return { ...token, expires: session.expires };
				}

				const unsafeDecodedAccessToken = decodeJwt(token.access_token);
				console.log(unsafeDecodedAccessToken[`https://knowledgebase.addvals.com/roles`]);

				return {
					expires: session.expires,
					user: {
						id: unsafeDecodedAccessToken?.sub ?? '',
						name: token.name,
						email: token.email,
						roles: unsafeDecodedAccessToken[`https://knowledgebase.addvals.com/roles`],
					},
					access_token: token.access_token,
					// refresh_token: token.refresh_token,
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
