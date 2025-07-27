import z from 'zod'

export const project = z.object({
  projectId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  color: z.string(),
})

export type Project = z.infer<typeof project>
