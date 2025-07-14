import clsx from 'clsx'
import type { FC } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/_abstract/libs/todo-client/components/select'
import type { Project } from '@/_abstract/libs/todo-server/schemas/projects'

type ProjectSelectorProps = {
  projects: Project[]
  selectedProject: string
  onProjectChange: (projectId: string) => void
}

export const ProjectSelector = (({
  projects,
  selectedProject,
  onProjectChange,
}) => {
  return (
    <div className={clsx('text-gray-500')}>
      <Select value={selectedProject} onValueChange={onProjectChange}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="プロジェクト選択" />
        </SelectTrigger>
        <SelectContent className={clsx('text-gray-500')}>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              <div className={clsx('flex', 'items-center', 'space-x-2')}>
                <div
                  className={clsx('w-3', 'h-3', 'rounded-full')}
                  style={{ backgroundColor: project.color }}
                />
                <span className={clsx('text-gray-500')}>{project.name}</span>
                <span className={clsx('text-xs', 'text-gray-500')}>
                  {project.taskCount}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}) satisfies FC<ProjectSelectorProps>
