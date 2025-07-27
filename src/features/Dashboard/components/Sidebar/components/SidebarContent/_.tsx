import clsx from 'clsx'
import { Check } from 'lucide-react'
import type { FC } from 'react'
import type { Simplify } from 'type-fest'
import { COLOR_OPTIONS } from '@/_abstract/libs/utils'

type SidebarContentProps = Simplify<{
  selectedProject: string
  setSelectedProject: (project: string) => void
  isSidebarCollapsed: boolean
  projects: {
    projectId: string
    name: string
    description?: string
    color: string
  }[]
}>

export const SidebarContent = (({
  selectedProject,
  setSelectedProject,
  isSidebarCollapsed,
  projects,
}) => {
  return (
    <div className={clsx('flex-1', 'overflow-y-auto', 'p-2')}>
      <div className={clsx('space-y-1')}>
        {projects.map((project) => (
          <button
            key={project.projectId}
            type="button"
            onClick={() => setSelectedProject(project.name)}
            className={clsx(
              'w-full',
              'text-left',
              'p-3',
              'rounded-lg',
              'cursor-pointer',
              `transition-colors ${
                selectedProject === project.name
                  ? 'bg-blue-50 border border-blue-400'
                  : 'hover:bg-blue-100'
              }`,
            )}
          >
            <div
              className={clsx('flex', 'items-start', 'justify-between', 'mb-2')}
            >
              <div className={clsx('flex', 'items-center', 'space-x-4')}>
                <div
                  className={clsx(
                    'w-3',
                    'h-3',
                    'rounded-full',
                    COLOR_OPTIONS.find(
                      (option) => option.value === project.color,
                    )?.class || 'bg-blue-500',
                  )}
                />
                {!isSidebarCollapsed && (
                  <span
                    className={clsx(
                      'font-medium',
                      'text-sm',
                      'text-gray-900',
                      'line-clamp-1',
                    )}
                  >
                    {project.name}
                  </span>
                )}
              </div>
              {selectedProject === project.name && !isSidebarCollapsed && (
                <Check
                  className={clsx(
                    'w-4',
                    'h-4',
                    'text-blue-600',
                    'flex-shrink-0',
                  )}
                />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}) satisfies FC<SidebarContentProps>
