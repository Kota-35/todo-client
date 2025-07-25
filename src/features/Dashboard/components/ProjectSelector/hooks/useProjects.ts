'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Project } from '@/_abstract/libs/todo-server/schemas/projects'

const QUERY_KEYS = {
  projects: (teamId?: string) => ['projects', teamId] as const,
}

// 特定チームのプロジェクト一覧を取得
const fetchTeamProjects = async (teamId: string): Promise<Project[]> => {
  const response = await fetch(`/api/v1/teams/${teamId}/projects`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch projects')
  }

  const data = await response.json()
  return data.data?.projects ?? []
}

// プロジェクトを作成
const createProject = async (params: {
  name: string
  description?: string
  color?: string
  teamId: string
}): Promise<Project> => {
  const response = await fetch('/api/v1/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    throw new Error('Failed to create project')
  }

  const data = await response.json()
  return data.data
}

// 特定チームのプロジェクト一覧取得フック
export const useTeamProjects = (teamId?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.projects(teamId),
    queryFn: () => fetchTeamProjects(teamId!),
    enabled: !!teamId, // teamIdが存在する時のみクエリを実行
  })
}

// プロジェクト作成フック
export const useCreateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProject,
    onSuccess: (_, variables) => {
      // 該当チームのプロジェクト一覧のキャッシュを無効化
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.projects(variables.teamId),
      })
    },
  })
}
