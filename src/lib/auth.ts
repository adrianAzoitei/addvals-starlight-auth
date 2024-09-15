import { Auth, type AuthConfig } from "@auth/core";
import type { FullAuthConfig } from "auth-astro/src/config";

/**
 * An array of path prefixes to require authentication for.
 */
export const paths = {
  '/installation': 'installation',
  '/welcome': 'general'
}

/**
 * Check if the request is authorized.
 * @param req The request
 * @param options Your auth config
 * @returns `true` if the request is authorized, `false` otherwise
 */
export async function isAuthed(req: Request, options: FullAuthConfig): Promise<AuthResult> {
  // @ts-ignore Logic to deal with runtime differences
  const url = new URL(req.url.pathname ?? req.url, `${process.env.DEV ? 'http' : 'https'}://${req.headers.host}`)
  const basePath = Object.keys(paths).find(p => url.pathname.startsWith(p)); 
  if (!basePath) return AuthResult.Ok;

  const session = await getSession(req, options)
  console.log("getSession")
  console.log(session);
  console.log(session?.user);
  // console.log(session?.user?.roles);

  if (!session) return AuthResult.Unauthenticated;

  ////////////////////////////////////
  // Add custom authorization steps //
  ////////////////////////////////////

  return session?.user?.roles?.includes((paths as any)[basePath]) ? AuthResult.Ok : AuthResult.Unauthorized;
}

/**
 * Fetches the current session. This is a modified implementation for use outside of Astro's runtime. Prefer `import { getSession } from "auth-astro/server"` over this if using in Astro.
 * @param req The request object.
 * @param options Optional Auth.js options
 * @returns The current session, or `null` if there is no session.
 */
export async function getSession(req: Request, options: AuthConfig): Promise<Session | null> {
  options.secret = process.env.AUTH_SECRET
  options.trustHost = true
  options.basePath = '/auth'

  // `req.url` can exclude the domain, so
  // @ts-ignore
	const url = new URL(`${options.basePath}/session`, `${process.env.DEV ? 'http' : 'https'}://${req.headers.host}`)
  // @ts-ignore
	const response = await Auth(new globalThis.Request(url, { headers: req.headers }), options)
	const { status = 200 } = response

  // @ts-ignore
	const data = await response.json()

	if (!data || !Object.keys(data).length) return null
	if (status === 200) return data
	throw new Error(data.message)
}
type ISODateString = string

interface Session {
  user?: User
  expires: ISODateString 
}

export interface User {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
  roles?: string[] | null
}

export enum AuthResult {
  Ok,
  Unauthenticated,
  Unauthorized
}
