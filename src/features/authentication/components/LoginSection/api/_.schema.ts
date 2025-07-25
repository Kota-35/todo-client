import z from 'zod'
import { createApiResponse } from '@/_abstract/libs/todo-server/schemas/common'

const loginData = z.object({
  email: z.string(),
  password: z.string(),
})

const loginResponseData = z.object({
  accessToken: z.string(),
  expiresAt: z.string(),
})

export const loginResponse = createApiResponse(loginResponseData)

export type LoginData = z.infer<typeof loginData>
export type LoginResponse = z.infer<typeof loginResponse>
