import clsx from 'clsx'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import type { FC } from 'react'
import type { Simplify } from 'type-fest'

type SidebarFooterProps = Simplify<{
  selectedProject: string
  isSidebarCollapsed: boolean
  toggleSidebar: () => void
}>

export const SidebarFooter = (({
  selectedProject,
  isSidebarCollapsed,
  toggleSidebar,
}) => {
  return (
    <div
      className={clsx(
        'p-4',
        'border-t',
        'border-gray-300',
        'relative',
        `flex`,
        'items-center',
        'justify-center',
        'h-16',
      )}
    >
      {!isSidebarCollapsed && (
        <span className={clsx('text-sm', 'text-gray-600')}>
          {selectedProject === ''
            ? 'プロジェクトを選択してください'
            : selectedProject}
        </span>
      )}

      {/* 閉じるアイコン */}
      <button
        className={clsx(
          'absolute',
          'right-4',
          'p-1',
          'hover:bg-blue-300',
          'rounded-4xl',
          'text-gray-500',
        )}
        onClick={toggleSidebar}
        type="button"
      >
        {isSidebarCollapsed ? (
          <ChevronsRight className={clsx('w-5', 'h-5')} />
        ) : (
          <ChevronsLeft className={clsx('w-5', 'h-5')} />
        )}
      </button>
    </div>
  )
}) satisfies FC<SidebarFooterProps>
