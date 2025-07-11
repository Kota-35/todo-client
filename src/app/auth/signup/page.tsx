import clsx from 'clsx'
import type { NextPage } from 'next'
import { RootHeader } from '@/app/(root)/_components/RootHeader'
import { RegisterSection } from '@/features/authentication/components/RegisterSection/_'

const Page = (() => {
  return (
    <div
      className={clsx(
        // 要素の高さを、ビューポートの最小高さいっぱいに設定する
        'min-h-screen',
        'bg-gradient-to-br',
        'from-blue-50',
        'to-indigo-100',
      )}
    >
      <RootHeader />

      <RegisterSection />
    </div>
  )
}) satisfies NextPage

export default Page
