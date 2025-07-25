import z from 'zod'

export const project = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  color: z.string(),
  taskCount: z.number().default(0),
  teamId: z.string(),
  ownerId: z.string(),
})

export type Project = z.infer<typeof project>
