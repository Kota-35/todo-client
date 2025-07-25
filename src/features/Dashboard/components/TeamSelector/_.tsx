'use client'

import clsx from 'clsx'
import { Plus, Users } from 'lucide-react'
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
  SelectTrigger,
  SelectValue,
} from '@/_abstract/libs/todo-client/components/select'
import {
  useCreateTeam,
  useTeams,
} from '@/features/Dashboard/components/TeamSelector/hooks/useTeams'

type TeamSelectorProps = {
  selectedTeam: string
  onTeamChange: (teamId: string) => void
}

export const TeamSelector = (({ selectedTeam, onTeamChange }) => {
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false)
  const [newTeamName, setNewTeamName] = useState('')
  const [newTeamDescription, setNewTeamDescription] = useState('')

  // React Queryフックを使用
  const { data: teams = [], isLoading } = useTeams()
  const createTeamMutation = useCreateTeam()

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return

    try {
      await createTeamMutation.mutateAsync({
        name: newTeamName,
        description: newTeamDescription,
      })

      // フォームをリセット
      setNewTeamName('')
      setNewTeamDescription('')
      setIsCreateTeamOpen(false)
    } catch (error) {
      console.error('チーム作成に失敗しました:', error)
    }
  }
  return (
    <div className={clsx('text-gray-500')}>
      <Select value={selectedTeam} onValueChange={onTeamChange}>
        <SelectTrigger className={clsx('w-64')}>
          <SelectValue placeholder="チームを選択" />
        </SelectTrigger>

        <SelectContent className={clsx('text-gray-500')}>
          {teams.length > 0 && (
            <>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  <div className={clsx('flex', 'items-center', 'space-x-2')}>
                    <span className={clsx('text-gray-500')}>{team.name}</span>
                  </div>
                </SelectItem>
              ))}
              <SelectSeparator />
            </>
          )}

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
            onClick={() => setIsCreateTeamOpen(true)}
          >
            <Plus className={clsx('w-4', 'h-4')} />
            <span>新しいチームを作成</span>
          </button>
        </SelectContent>
      </Select>

      {/* チーム作成ダイアログ */}
      <Dialog open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
        <DialogContent
          className={clsx('sm:max-w-[425px]', 'bg-white', 'text-gray-500')}
        >
          <DialogHeader>
            <DialogTitle className={clsx('flex', 'items-center', 'space-x-2')}>
              <Users className="w-5 h-5" />
              <span>新しいチームを作成</span>
            </DialogTitle>
            <DialogDescription>
              新しいチームを作成して、メンバーと一緒にプロジェクトを管理しましょう。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="team-name">チーム名 *</Label>
              <Input
                id="team-name"
                placeholder="例: デザインチーム"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="team-description">説明（任意）</Label>
              <Input
                id="team-description"
                placeholder="チームの目的や役割について簡単に説明してください"
                value={newTeamDescription}
                onChange={(e) => setNewTeamDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateTeamOpen(false)}
              disabled={createTeamMutation.isPending}
            >
              キャンセル
            </Button>
            <Button
              onClick={handleCreateTeam}
              disabled={!newTeamName.trim() || createTeamMutation.isPending}
            >
              {createTeamMutation.isPending
                ? 'チーム作成中...'
                : 'チームを作成'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}) satisfies FC<TeamSelectorProps>
