import z from 'zod'
import { createApiResponse } from '@/_abstract/libs/todo-server/schemas/common'

export const createProjectResponse = createApiResponse(
  z.object({
    projectId: z.string(),
    name: z.string(),
    description: z.string().optional(),
    color: z.string(),
  }),
)

export type CreateProjectResponse = z.infer<typeof createProjectResponse>

const createProjectData = z.object({
  name: z.string(),
  description: z.string().optional(),
  color: z.string(),
})

export type CreateProjectData = z.infer<typeof createProjectData>
