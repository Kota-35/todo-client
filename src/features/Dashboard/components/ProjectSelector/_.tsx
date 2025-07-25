import clsx from 'clsx'
import { Plus } from 'lucide-react'
import { type FC, useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
} from '@/_abstract/libs/todo-client/components/select'
import { useCreateProject, useTeamProjects } from './hooks'

type ProjectSelectorProps = {
  teamId?: string
  selectedProject: string
  onProjectChange: (projectId: string) => void
}

export const ProjectSelector = (({
  teamId,
  selectedProject,
  onProjectChange,
}) => {
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDescription, setNewProjectDescription] = useState('')
  const [newProjectColor, setNewProjectColor] = useState('#3b82f6')

  // React Queryフックを使用
  const { data: projects = [], isLoading } = useTeamProjects(teamId)
  const createProjectMutation = useCreateProject()

  const handleCreateProject = async () => {
    if (!newProjectName.trim() || !teamId) return

    try {
      await createProjectMutation.mutateAsync({
        name: newProjectName,
        description: newProjectDescription,
        color: newProjectColor,
        teamId,
      })

      // フォームをリセット
      setNewProjectName('')
      setNewProjectDescription('')
      setNewProjectColor('#3b82f6')
      setIsCreateProjectOpen(false)
    } catch (error) {
      console.error('プロジェクト作成に失敗しました:', error)
    }
  }
  return (
    <div className={clsx('text-gray-500')}>
      <Select value={selectedProject} onValueChange={onProjectChange}>
        <SelectContent className={clsx('text-gray-500')}>
          {projects.length > 0 && (
            <>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  <div className={clsx('flex', 'items-center', 'space-x-2')}>
                    <div
                      className={clsx('w-3', 'h-3', 'rounded-full')}
                      style={{ backgroundColor: project.color }}
                    />
                    <span className={clsx('text-gray-500')}>
                      {project.name}
                    </span>
                    <span className={clsx('text-xs', 'text-gray-500')}>
                      {project.taskCount}
                    </span>
                  </div>
                </SelectItem>
              ))}
              <SelectSeparator />
            </>
          )}

          {teamId && (
            <button
              type="button"
              className={clsx(
                'flex',
                'items-center',
                'space-x-2',
                'px-2',
                'py-1.5',
                'text-sm',
                'text-blue-500',
                'hover:bg-gray-100',
                'rounded-sm',
                'w-full',
                'text-left',
              )}
              onClick={() => setIsCreateProjectOpen(true)}
            >
              <Plus className={clsx('w-4', 'h-4')} />
              <span>新しいプロジェクトを作成</span>
            </button>
          )}
        </SelectContent>
      </Select>

      {/* プロジェクト作成ダイアログ */}
      <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
        <DialogContent
          className={clsx('sm:max-w-[425px]', 'bg-white', 'text-gray-500')}
        >
          <DialogHeader>
            <DialogTitle className={clsx('flex', 'items-center', 'space-x-2')}>
              <Plus className="w-5 h-5" />
              <span>新しいプロジェクトを作成</span>
            </DialogTitle>
            <DialogDescription>
              新しいプロジェクトを作成して、タスクを整理しましょう。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="project-name">プロジェクト名 *</Label>
              <Input
                id="project-name"
                placeholder="例: ウェブサイトリニューアル"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-description">説明（任意）</Label>
              <Input
                id="project-description"
                placeholder="プロジェクトの目的や概要を入力してください"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-color">カラー</Label>
              <input
                id="project-color"
                type="color"
                value={newProjectColor}
                onChange={(e) => setNewProjectColor(e.target.value)}
                className={clsx('w-16', 'h-8', 'rounded', 'border')}
              />
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
              onClick={handleCreateProject}
              disabled={
                !newProjectName.trim() || createProjectMutation.isPending
              }
            >
              {createProjectMutation.isPending
                ? 'プロジェクト作成中...'
                : 'プロジェクトを作成'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}) satisfies FC<ProjectSelectorProps>
