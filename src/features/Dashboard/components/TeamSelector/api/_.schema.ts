import z from 'zod'
import { createApiResponse } from '@/_abstract/libs/todo-server/schemas/common'
import { team } from '@/_abstract/libs/todo-server/schemas/teams'

export const fetchTeamsResponse = createApiResponse(
  z.object({ teams: z.array(team) }),
)

export type FetchTeamsResponse = z.infer<typeof fetchTeamsResponse>

export const createTeamData = z.object({
  name: z.string(),
  description: z.string().optional(),
})

export const createTeamResponse = createApiResponse(team)

export type CreateTeamResponse = z.infer<typeof createTeamResponse>
export type CreateTeamData = z.infer<typeof createTeamData>
