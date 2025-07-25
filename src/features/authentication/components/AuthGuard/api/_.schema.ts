import z from 'zod'
import { createApiResponse } from '@/_abstract/libs/todo-server/schemas/common'

export const validateSessionResponse = createApiResponse(z.object())

export type ValidateSessionResponse = z.infer<typeof validateSessionResponse>

export const refreshSessionResponse = createApiResponse(
  z.object({
    accessToken: z.string(),
    AccessTokenExpiresAt: z.string(),
  }),
)

export type RefreshSessionResponse = z.infer<typeof refreshSessionResponse>
