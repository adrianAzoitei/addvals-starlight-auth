import express, { type NextFunction, type Request, type Response } from 'express'
import { handler as ssrHandler, options } from '../../dist/server/entry.mjs'
import fs from 'node:fs'
import { join } from 'node:path'
import { generateConfig } from '../../auth.config.js'
import { config } from 'dotenv'
import { isAuthed } from '../lib/auth.ts'

config()

const authConfig = generateConfig({
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  issuer: process.env.ISSUER!,
  namespace: process.env.AUTH0_NAMESPACE!,
  audience: process.env.AUTH0_AUDIENCE!
})

const unauthorizedPage = fs.readFileSync(join(new URL(options.client).pathname, '401', 'index.html'), 'utf8')

const app = express();
const handleStatic = express.static('dist/client/')

function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(401)
  res.send(unauthorizedPage);
}

app.use(async (req, res, next) => {
  // @ts-ignore
  if (!await isAuthed(req, authConfig)) return notFound(req, res, next)

  // handle static files first, then fallback on the SSR handler before hitting 404
  handleStatic(req, res, () => ssrHandler(req, res, () => notFound(req, res, next)));
});

app.listen(4321);
