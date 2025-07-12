import { createEnv } from '@t3-oss/env-nextjs'
import { string } from 'zod'

export const env = createEnv({
  client: {},
  server: {
    SERVER_ORIGIN: string()
      .max(128)
      .default('')
      .describe('サーバーのベースURLになります。ex: https//localhost:4000'),
  },
  experimental__runtimeEnv: {
    SERVER_ORIGIN: process.env.SERVER_ORIGIN,
  },
})

export type Env = typeof env
