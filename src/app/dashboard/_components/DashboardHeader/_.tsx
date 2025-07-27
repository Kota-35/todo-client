'use client'

import clsx from 'clsx'
import { ListTodo, LogOut, Plus, Settings } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { type FC, useEffect, useState } from 'react'
import type { Simplify } from 'type-fest'
import { Button } from '@/_abstract/libs/todo-client/components/button'
import { useLogout } from '@/features/authentication/hooks'
import { TeamSelector } from '@/features/Dashboard/components/TeamSelector'

type Props = Simplify<Record<string, never>>

// モックデータの型定義
type Project = {
  id: string
  name: string
  description?: string
  color: string
  taskCount: number
}

type TaskStatus = {
  id: string
  name: string
  color: string
  position: number
}

type Task = {
  id: string
  title: string
  description?: string
  projectId: string
  statusId: string
  priorityId?: string
  assigneeId?: string
  dueDate?: string
  completionRate: number
  tags: string[]
  commentsCount: number
  attachmentsCount: number
}

type AppUser = {
  id: string
  username: string
  email: string
  avatarUrl?: string
}

export const DashboardHeader = (() => {
  const router = useRouter()
  const params = useParams<{ teamId?: string }>()
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [selectedTeam, setSelectedTeam] = useState<string>('')
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)

  const logoutMutation = useLogout()

  // URLパラメータからteamIdを取得してselectedTeamを設定
  useEffect(() => {
    if (params.teamId) {
      setSelectedTeam(params.teamId)
    }
  }, [params.teamId])

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const handleTeamChange = (teamId: string) => {
    setSelectedTeam(teamId)
    // チーム選択時にdashboard/[teamId]ページに移動
    router.push(`/dashboard/${teamId}`)
  }

  // モックデータ
  const projects: Project[] = [
    {
      id: '1',
      name: 'ウェブサイトリニューアル',
      description: '会社サイトの全面リニューアル',
      color: '#3b82f6',
      taskCount: 12,
    },
    {
      id: '2',
      name: 'モバイルアプリ開発',
      description: 'iOS/Androidアプリの新規開発',
      color: '#10b981',
      taskCount: 8,
    },
    {
      id: '3',
      name: 'マーケティング施策',
      description: 'Q1マーケティング活動',
      color: '#f59e0b',
      taskCount: 5,
    },
  ]

  const taskStatuses: TaskStatus[] = [
    { id: '1', name: '未着手', color: '#6b7280', position: 0 },
    { id: '2', name: '進行中', color: '#3b82f6', position: 1 },
    { id: '3', name: 'レビュー', color: '#f59e0b', position: 2 },
    { id: '4', name: '完了', color: '#10b981', position: 3 },
  ]

  const tasks: Task[] = [
    {
      id: '1',
      title: 'デザインシステムの構築',
      description: '統一されたデザインシステムを作成する',
      projectId: '1',
      statusId: '2',
      priorityId: 'high',
      assigneeId: 'user1',
      dueDate: '2024-01-15',
      completionRate: 60,
      tags: ['デザイン', 'システム'],
      commentsCount: 3,
      attachmentsCount: 2,
    },
    {
      id: '2',
      title: 'APIエンドポイントの実装',
      description: 'ユーザー管理用のREST APIを実装',
      projectId: '1',
      statusId: '1',
      priorityId: 'high',
      assigneeId: 'user2',
      dueDate: '2024-01-20',
      completionRate: 0,
      tags: ['API', 'バックエンド'],
      commentsCount: 1,
      attachmentsCount: 0,
    },
    {
      id: '3',
      title: 'フロントエンド画面作成',
      description: 'ユーザーダッシュボード画面の実装',
      projectId: '1',
      statusId: '3',
      priorityId: 'medium',
      assigneeId: 'user1',
      dueDate: '2024-01-25',
      completionRate: 90,
      tags: ['フロントエンド', 'React'],
      commentsCount: 5,
      attachmentsCount: 1,
    },
    {
      id: '4',
      title: 'テストケース作成',
      description: '単体���ストと統合テストの作成',
      projectId: '1',
      statusId: '4',
      priorityId: 'low',
      assigneeId: 'user3',
      dueDate: '2024-01-10',
      completionRate: 100,
      tags: ['テスト'],
      commentsCount: 2,
      attachmentsCount: 3,
    },
  ]

  const users: AppUser[] = [
    {
      id: 'user1',
      username: '田中太郎',
      email: 'tanaka@example.com',
      avatarUrl: '/placeholder.svg?height=32&width=32',
    },
    {
      id: 'user2',
      username: '佐藤花子',
      email: 'sato@example.com',
      avatarUrl: '/placeholder.svg?height=32&width=32',
    },
    {
      id: 'user3',
      username: '鈴木次郎',
      email: 'suzuki@example.com',
      avatarUrl: '/placeholder.svg?height=32&width=32',
    },
  ]

  return (
    <header
      className={clsx(
        'w-full', // width: 100%;
        // FYI: padding-inlineとpadding-block
        //      インライン方向とブロック方向
        //      - インライン方向: 文章の進行方向
        //      - ブロック方向: 文章の垂直方向
        // [More: https://web-kiso.com/css-padding/]
        'py-6', // padding-block: calc(var(--spacing) * <number>);
        'px-4', // padding-inline: calc(var(--spacing) * <number>);
      )}
    >
      <div
        className={clsx(
          // コンテナの最大幅を72rem（1152px）に制限します
          // max-width: var(--container-6xl); /* 72rem (1152px) */
          'max-w-6xl',
          // 要素の左右のマージンを自動的に均等に設定
          // 最大幅に制限されたコンテナを画面の中央に配置することができる
          'mx-auto',
          // [More: https://tailwindcss.com/docs/flex]
          'flex', // コンテナをflexboxとして設定
          'items-center', // 子要素を垂直方向の中央に配置
          'justify-between', // 子要素を水平方向に均等に分散配置
        )}
      >
        <div
          className={clsx(
            'flex',
            'items-center',
            'space-x-2', // 子要素に水平方向のスペース
          )}
        >
          <ListTodo
            onClick={() => router.push('/')}
            className={clsx('h-8', 'w-8', 'text-blue-600')}
          />
          <h1 className={clsx('text-gray-900', 'text-2xl', 'font-bold')}>
            TodoApp
          </h1>
          <div className={clsx('pl-4', 'flex', 'items-center', 'space-x-4')}>
            <TeamSelector
              selectedTeam={selectedTeam}
              onTeamChange={handleTeamChange}
            />
          </div>
        </div>

        <div className={clsx('flex', 'items-center', 'space-x-4')}>
          <Button
            onClick={() => setIsCreateTaskOpen(true)}
            disabled={!selectedProject}
            className={clsx(
              'flex',
              'items-center',
              'space-x-2',
              'text-gray-900',
              'bg-blue-200',
            )}
          >
            <Plus className={clsx('h-4', 'w-4')} />
            <span>タスク作成</span>
          </Button>

          <Button variant="ghost" size="sm">
            <Settings className={clsx('h-4', 'w-4', 'text-gray-900')} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className={clsx('h-4', 'w-4', 'text-gray-900')} />
          </Button>
        </div>
      </div>
    </header>
  )
}) satisfies FC<Props>
