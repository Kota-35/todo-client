'use server'

import { makeFetcher } from '@/_abstract/libs/todo-server/api'
import {
  type CreateProjectData,
  type CreateProjectResponse,
  createProjectResponse,
} from '@/features/Dashboard/components/Sidebar/api/createProject/_.schema.ts'

type CreateProject = (
  teamId: string,
  data: CreateProjectData,
) => Promise<CreateProjectResponse>

export const createProject = (async (teamId, data) => {
  const fetcher = await makeFetcher<CreateProjectData, CreateProjectResponse>({
    path: `/teams/${teamId}/projects`,
    method: 'POST',
    responseBody: createProjectResponse,
  })

  return await fetcher(data)
}) satisfies CreateProject
