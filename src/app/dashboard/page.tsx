import clsx from 'clsx'
import type { NextPage } from 'next'
import { DashboardHeader } from './_components/DashboradHeader/_'

const DashboardPage = (() => {
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
    </div>
  )
}) satisfies NextPage

export default DashboardPage
