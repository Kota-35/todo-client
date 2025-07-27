import z from 'zod'
import { createApiResponse } from '@/_abstract/libs/todo-server/schemas/common'

const signupData = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
})

const signupResponseData = z.object({
  userId: z.string(),
  email: z.string(),
  username: z.string(),
  message: z.string(),
})

export const signupResponse = createApiResponse(signupResponseData)

export type SignupData = z.infer<typeof signupData>
export type SignupResponse = z.infer<typeof signupResponse>
