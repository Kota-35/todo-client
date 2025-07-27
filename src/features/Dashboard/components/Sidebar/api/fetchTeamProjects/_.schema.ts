import z from 'zod'
import { createApiResponse } from '@/_abstract/libs/todo-server/schemas/common'

export const fetchTeamProjectsResponse = createApiResponse(
  z.array(
    z.object({
      projectId: z.string(),
      name: z.string(),
      description: z.string().optional(),
      color: z.string(),
    }),
  ),
)

export type FetchTeamProjectsResponse = z.infer<
  typeof fetchTeamProjectsResponse
>
