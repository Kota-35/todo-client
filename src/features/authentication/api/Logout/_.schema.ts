import { z } from 'zod'

export const logoutActionSchema = z.object({})

export type LogoutActionSchema = z.infer<typeof logoutActionSchema>
