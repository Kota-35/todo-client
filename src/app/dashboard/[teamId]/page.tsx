'use client'

import clsx from 'clsx'
import type { NextPage } from 'next'
import { useParams } from 'next/navigation'
import { DashboardHeader } from '@/app/dashboard/_components/DashboardHeader/_'
import { Sidebar } from '@/features/Dashboard/components/Sidebar'

const DashboardPage = (() => {
  const params = useParams<{ teamId: string }>()
  const teamId = params.teamId

  return (
    <div
      className={clsx(
        //　要素の高さを、ビューボードの最小、高さをいっぱいに設定する
        'min-h-screen',
        'bg-gradient-to-br',
        'from-blue-50',
        'to-indigo-100',
      )}
    >
      <DashboardHeader />

      <Sidebar teamId={teamId} />
    </div>
  )
}) satisfies NextPage

export default DashboardPage
