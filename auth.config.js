import Auth0 from '@auth/core/providers/auth0';
import axios from 'axios';

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
					  scope: `openid email profile offline_access`,
					  audience: audience
					},
				  },
			})
		],
		callbacks: {
			async jwt({ token, account, profile }) {
				console.log("JWT")
				// console.log(account)
				// console.log("----")
				// console.log(token)
				// console.log("----")
				// console.log(profile)
				// Persist the OAuth access_token and or the user id to the token right after signin
				if (account) {
					token.access_token = account.access_token;
					token.refresh_token = account.refresh_token;
					token.id_token = account.id_token;
					token.roles = profile[`https://knowledgebase.addvals.com/roles`];
					console.log(token)
					return token;
				}
				if (!token.refresh_token || !token.id_token || !token.access_token) {
				// if (!token.id_token || !token.access_token) {
					return {};
				}
				return token;
			  },
			  async session(args) {
				const { session, token } = args;
				console.log("SESSION");
				console.log(token)
				if (!token.access_token || !token.refresh_token || !token.id_token) {
				// if (!token.access_token || !token.id_token) {
					return { ...token, expires: session.expires };
				}

				// if token almost expires (compare with exp.)
				var options = {
					method: 'POST',
					url: `${issuer}/oauth/token`,
					headers: {'content-type': 'application/x-www-form-urlencoded'},
					data: new URLSearchParams({
					  grant_type: 'refresh_token',
					  client_id: clientId,
					  client_secret: clientSecret,
					  refresh_token: token.refresh_token
					})
				  };
				  
				  axios.request(options).then(function (response) {
					console.log(response.data);
				  }).catch(function (error) {
					console.error(error);
				  });

				return {
					expires: session.expires,
					user: {
						id: token.sub ?? '',
						name: token.name,
						email: token.email,
						roles: token.roles,
					},
					access_token: token.access_token,
					refresh_token: token.refresh_token,
					error: token.error
				};
			},
	}
}
}
