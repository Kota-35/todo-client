'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createTeam,
  fetchTeams,
} from '@/features/Dashboard/components/TeamSelector/api'

const QUERY_KEYS = {
  teams: ['teams'] as const,
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
