import { type UseQueryResult, useQuery } from '@tanstack/react-query'

import { fetchTeamProjects } from '@/features/Dashboard/components/Sidebar/api/fetchTeamProjects'

const QUERY_KEYS = {
  projects: (teamId?: string) => ['projects', teamId] as const,
}

type UseTeamProjects = (teamId: string) => UseQueryResult

export const useTeamProjects = ((teamId) => {
  return useQuery({
    queryKey: QUERY_KEYS.projects(teamId),
    queryFn: () => fetchTeamProjects(teamId),
    enabled: !!teamId,
  })
}) satisfies UseTeamProjects
