'use server'

import { stringifyReplaceError } from '@/_abstract/libs/mdn/stringify/stringifyReplaceError'
import { makeFetcher } from '@/_abstract/libs/todo-server/api'
import {
  type FetchTeamProjectsResponse,
  fetchTeamProjectsResponse,
} from '@/features/Dashboard/components/Sidebar/api/fetchTeamProjects/_.schema'
export type FetchTeamProjects = (
  teamId: string,
) => Promise<FetchTeamProjectsResponse>

// チームのプロジェクトを取得する.
export const fetchTeamProjects = (async (teamId) => {
  const fetcher = await makeFetcher<undefined, FetchTeamProjectsResponse>({
    path: `/teams/${teamId}/projects`,
    method: 'GET',
    responseBody: fetchTeamProjectsResponse,
  }).catch((error) => {
    console.error(
      '[fetchTeamProjects]',
      JSON.stringify(error, stringifyReplaceError, 2),
    )
    throw error
  })

  return await fetcher(undefined)
}) satisfies FetchTeamProjects
