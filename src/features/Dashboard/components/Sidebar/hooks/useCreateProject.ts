import {
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  type CreateProjectData,
  type CreateProjectResponse,
  createProject,
} from '@/features/Dashboard/components/Sidebar/api/createProject'

const QUERY_KEYS = {
  projects: (teamId?: string) => ['projects', teamId] as const,
}

type UseCreateProject = (
  teamId: string,
) => UseMutationResult<CreateProjectResponse, Error, CreateProjectData, unknown>

export const useCreateProject = ((teamId) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => createProject(teamId, data),
    onSuccess: () => {
      // プロジェクト作成成功後にプロジェクト一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects(teamId) })
    },
  })
}) satisfies UseCreateProject
