'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Team } from '@/_abstract/libs/todo-server/schemas/teams'

const QUERY_KEYS = {
  teams: ['teams'] as const,
}

// チーム一覧を取得
const fetchTeams = async (): Promise<Team[]> => {
  const response = await fetch('/api/v1/teams/me', {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch teams')
  }

  const data = await response.json()
  return data.data?.teams ?? []
}

// チームを作成
const createTeam = async (params: {
  name: string
  description?: string
}): Promise<Team> => {
  const response = await fetch('/api/v1/teams', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    throw new Error('Failed to create team')
  }

  const data = await response.json()
  return data.data
}

// チーム一覧取得フック
export const useTeams = () => {
  return useQuery({
    queryKey: QUERY_KEYS.teams,
    queryFn: fetchTeams,
  })
}

// チーム作成フック
export const useCreateTeam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      // チーム作成成功後にチーム一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.teams })
    },
  })
}
