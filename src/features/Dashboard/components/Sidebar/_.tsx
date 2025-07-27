'use client'

import clsx from 'clsx'
import type { FC } from 'react'
import { useState } from 'react'
import type { Simplify } from 'type-fest'
import { SidebarContent } from '@/features/Dashboard/components/Sidebar/components/SidebarContent'
import { SidebarFooter } from '@/features/Dashboard/components/Sidebar/components/SidebarFooter'
import { SidebarHeader } from '@/features/Dashboard/components/Sidebar/components/SidebarHeader'
import { useTeamProjects } from '@/features/Dashboard/components/Sidebar/hooks'

type SidebarProps = Simplify<{
  teamId: string
}>

export const Sidebar = (({ teamId }) => {
  const [selectedProject, setSelectedProject] = useState('')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev)
  }

  const { data: responseData } = useTeamProjects(teamId)

  // プロジェクトを取り出す
  const projects = responseData
    ? responseData.data
      ? responseData.data
      : []
    : []

  return (
    <div
      className={clsx(
        isSidebarCollapsed ? 'w-16' : 'w-80',
        'border-gray-300',
        'flex',
        'flex-col',
        'bg-blue-50',
        'relative',
        'left-2',
        'border',
        'rounded-2xl',
      )}
    >
      <SidebarHeader isSidebarCollapsed={isSidebarCollapsed} teamId={teamId} />

      <SidebarContent
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        isSidebarCollapsed={isSidebarCollapsed}
        projects={projects}
      />

      <SidebarFooter
        selectedProject={selectedProject}
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />
    </div>
  )
}) satisfies FC<SidebarProps>
