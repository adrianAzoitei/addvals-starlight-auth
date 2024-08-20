import Keycloak from '@auth/core/providers/keycloak'

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
				// wellKnown: `${issuer}/.well-known/openid-configuration`,
				authorization: {
					params: {
					  scope: "openid email profile roles",
					},
					// url: `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/auth`,
				  },
			})
		],
		callbacks: {
			async jwt(params) {
				console.log(params);
			}
		// async signIn({ profile }) {
		//    // Only allow sign in for users with email addresses ending with "yourdomain.com"
		//    return profile?.email?.endsWith("@gmail.com")
		//  }
	}
}
}
