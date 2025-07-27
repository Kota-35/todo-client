import clsx from 'clsx'
import { Building2, Plus } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'
import type { Simplify } from 'type-fest'
import { Button } from '@/_abstract/libs/todo-client/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/_abstract/libs/todo-client/components/dialog'
import { Input } from '@/_abstract/libs/todo-client/components/input'
import { Label } from '@/_abstract/libs/todo-client/components/label'
import { COLOR_OPTIONS } from '@/_abstract/libs/utils'
import {
  useCreateProject,
  useTeamProjects,
} from '@/features/Dashboard/components/Sidebar/hooks'

type SidebarHeaderProps = Simplify<{
  isSidebarCollapsed: boolean
  teamId: string
}>

export const SidebarHeader = (({ isSidebarCollapsed, teamId }) => {
  // プロジェクト作成ダイアログのstate
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [projectColor, setProjectColor] = useState('#3B82F6') // デフォルトは青色
  const createProjectMutation = useCreateProject(teamId)
  const { data: projects = [] } = useTeamProjects(teamId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // バリデーション
    if (!projectName.trim()) {
      alert('プロジェクト名を入力してください')
      return
    }

    // 重複チェック
    const trimmedName = projectName.trim()
    const projectList = Array.isArray(projects)
      ? projects
      : projects?.data || []
    const isDuplicate = projectList.some(
      (project: { name: string }) =>
        project.name.toLowerCase() === trimmedName.toLowerCase(),
    )

    if (isDuplicate) {
      alert(
        `プロジェクト名「${trimmedName}」は既に存在します。別の名前を入力してください。`,
      )
      return
    }

    createProjectMutation.mutate(
      {
        name: projectName.trim(),
        description: projectDescription.trim() || undefined,
        color: projectColor,
      },
      {
        onSuccess: () => {
          // フォームをリセット
          setProjectName('')
          setProjectDescription('')
          setProjectColor('#3B82F6')
          setIsCreateProjectOpen(false)
        },
        onError: (error) => {
          // エラーメッセージを表示
          console.error('プロジェクト作成エラー:', error)
          alert(`プロジェクトの作成に失敗しました: ${error.message}`)
        },
      },
    )
  }

  return (
    <>
      <div className={clsx('p-4', 'border-b', 'border-gray-300')}>
        <div className={clsx('flex', 'items-center', 'justify-between')}>
          <h2
            className={clsx(
              'text-lg',
              'font-semibold',
              'text-gray-900',
              'flex',
              'items-center',
              'space-x-4',
            )}
          >
            <Building2 className={clsx('w-5', 'h-5')} />
            {!isSidebarCollapsed && <span>プロジェクト</span>}
          </h2>

          {/* サイドバーが縮小されている場合でも新規プロジェクト作成ボタンを表示 */}
          <Button
            size="sm"
            onClick={() => setIsCreateProjectOpen(true)}
            className={clsx(
              'flex',
              'items-center',
              isSidebarCollapsed ? 'justify-center' : 'space-x-1',
              'text-gray-500',
              'bg-blue-200',
              isSidebarCollapsed ? 'w-8 h-8 p-0' : '',
              isSidebarCollapsed ? 'rounded-4xl' : '',
            )}
            title={isSidebarCollapsed ? '新しいプロジェクトを作成' : undefined}
          >
            <Plus className={clsx('w-4 h-4')} />
            {!isSidebarCollapsed && <span>新規</span>}
          </Button>
        </div>
      </div>

      {/* プロジェクト作成ダイアログ */}
      <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
        <DialogContent
          className={clsx('sm:max-w-[425px]', 'bg-white', 'text-gray-500')}
        >
          <DialogHeader>
            <DialogTitle className={clsx('flex', 'items-center', 'space-x-2')}>
              <Building2 className="w-5 h-5" />
              <span>新しいプロジェクトを作成</span>
            </DialogTitle>
            <DialogDescription>
              新しいプロジェクトを作成して、チームでタスクを管理しましょう。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="project-name">プロジェクト名 *</Label>
              <Input
                id="project-name"
                placeholder="例: ウェブサイトリニューアル"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-description">説明（任意）</Label>
              <Input
                id="project-description"
                placeholder="プロジェクトの目的や内容について簡単に説明してください"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-color">色</Label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setProjectColor(color.value)}
                    className={clsx(
                      'w-8 h-8 rounded-full border-2 transition-all',
                      color.class,
                      projectColor === color.value
                        ? 'border-gray-800 scale-110'
                        : 'border-gray-300 hover:border-gray-500',
                    )}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateProjectOpen(false)}
              disabled={createProjectMutation.isPending}
            >
              キャンセル
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!projectName.trim() || createProjectMutation.isPending}
            >
              {createProjectMutation.isPending
                ? 'プロジェクト作成中...'
                : 'プロジェクトを作成'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}) satisfies FC<SidebarHeaderProps>
