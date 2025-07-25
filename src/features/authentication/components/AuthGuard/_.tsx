'use client'

import { useRouter } from 'next/navigation'
import { type FC, type ReactNode, useEffect } from 'react'
import type { Simplify } from 'type-fest'
import { useSession } from '../../hooks'

type Props = Simplify<{
  children: ReactNode
  redirectTo?: string
}>

export const AuthGuard = (({ children, redirectTo = '/auth/login' }) => {
  const router = useRouter()
  const { data: session, isLoading, error } = useSession()

  useEffect(() => {
    if (!isLoading && (!session?.authenticated || error)) {
      router.push(redirectTo)
    }
  }, [session, isLoading, error, router, redirectTo])

  // ローディング中は何も表示しない
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // 認証されていない場合は何も表示しない（リダイレクト処理中）
  if (!session?.authenticated || error) {
    return null
  }

  return <>{children}</>
}) satisfies FC<Props>
