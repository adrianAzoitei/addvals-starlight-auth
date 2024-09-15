import express, { type NextFunction, type Request, type Response } from 'express'
import { handler as ssrHandler, options } from '../../dist/server/entry.mjs'
import fs from 'node:fs'
import { join } from 'node:path'
import { generateConfig } from '../../auth.config.js'
import { config } from 'dotenv'
import { AuthResult, isAuthed } from '../lib/auth.ts'

config()

const authConfig = generateConfig({
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  issuer: process.env.ISSUER!,
  namespace: process.env.AUTH0_NAMESPACE!,
  audience: process.env.AUTH0_AUDIENCE!
})

const unauthPage = fs.readFileSync(join(new URL(options.client).pathname, '401', 'index.html'), 'utf8')
const unauthorizedPage = fs.readFileSync(join(new URL(options.client).pathname, '403', 'index.html'), 'utf8')

const app = express();
const handleStatic = express.static('dist/client/')

function unauth(req: Request, res: Response, next: NextFunction) {
  res.status(401)
  res.send(unauthPage);
}

function unauthorized(req: Request, res: Response, next: NextFunction) {
  res.status(403)
  res.send(unauthorizedPage);
}

app.use(async (req, res, next) => {
  // @ts-ignore
  switch (await isAuthed(req, authConfig)) {
    case AuthResult.Unauthenticated:
      return unauth(req, res, next);
    case AuthResult.Unauthorized:
      return unauthorized(req, res, next);
  }
  // handle static files first, then fallback on the SSR handler before hitting 404
  handleStatic(req, res, () => ssrHandler(req, res, () => unauth(req, res, next)));
});

app.listen(process.env.PORT, function() {
  console.log(`Listening on port: ${process.env.PORT}`);
});
