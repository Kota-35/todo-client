'use server'

import { makeFetcher } from '@/_abstract/libs/todo-server/api'
import {
  type CreateTeamData,
  type CreateTeamResponse,
  createTeamResponse,
  type FetchTeamsResponse,
  fetchTeamsResponse,
} from '@/features/Dashboard/components/TeamSelector/api/_.schema'

export type FetchTeams = () => Promise<FetchTeamsResponse>

export const fetchTeams = (async () => {
  const fetcher = await makeFetcher<undefined, FetchTeamsResponse>({
    path: '/teams/me',
    method: 'GET',
    responseBody: fetchTeamsResponse,
  })

  return await fetcher(undefined)
}) satisfies FetchTeams

export type CreateTeam = (data: CreateTeamData) => Promise<CreateTeamResponse>

export const createTeam = (async (data) => {
  const fetcher = await makeFetcher<CreateTeamData, CreateTeamResponse>({
    path: '/teams',
    method: 'POST',
    responseBody: createTeamResponse,
  })

  return await fetcher(data)
}) satisfies CreateTeam
