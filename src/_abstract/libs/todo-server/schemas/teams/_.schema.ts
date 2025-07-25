import z from 'zod'

export const team = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  ownerId: z.string(),
})

export type Team = z.infer<typeof team>
