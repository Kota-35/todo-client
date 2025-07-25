'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type FC, type ReactNode, useState } from 'react'
import type { Simplify } from 'type-fest'

type Props = Simplify<{
  children: ReactNode
}>

export const ReactQueryProvider = (({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              // 認証エラーの場合はリトライしない
              if (error instanceof Error && error.message.includes('401')) {
                return false
              }
              // その他のエラーは最大3回までリトライ
              return failureCount < 3
            },
            staleTime: 5 * 60 * 1000, // 5分間はキャッシュを有効とする
            refetchOnWindowFocus: false, // ウィンドウフォーカス時の自動リフェッチを無効化
          },
          mutations: {
            retry: false, // ミューテーションはリトライしない
            onError: (error) => {
              console.error('Mutation error:', error)
              // 必要に応じてグローバルエラーハンドリング
            },
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}) satisfies FC<Props>
