import clsx from 'clsx'
import type { NextPage } from 'next'
import { RootHeader } from '@/app/(root)/_components/RootHeader'
import { LoginSection } from '@/features/authentication/components/LoginSection'

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

      <LoginSection />
    </div>
  )
}) satisfies NextPage

export default Page
