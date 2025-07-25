'use client'

import { type UseQueryResult, useQuery } from '@tanstack/react-query'

import {
  refreshSession,
  validateSession,
} from '@/features/authentication/components/AuthGuard/api'
import { QUERY_KEYS } from '@/features/authentication/hooks/useAuth'

type UseSession = () => UseQueryResult

export const useSession = (() => {
  return useQuery({
    queryKey: QUERY_KEYS.session,
    queryFn: async () => {
      try {
        // まずvalidateSessionを試行
        return await validateSession()
      } catch (_) {
        // アクセストークンが期限切れの場合、リフレッシュを試行
        try {
          await refreshSession()
          // リフレッシュ成功後、再度validateSessionを実行
          return await validateSession()
        } catch (_) {
          // リフレッシュも失敗した場合、エラーを投げる
          throw new Error('Session expired and refresh failed')
        }
      }
    },
    retry: false,
    staleTime: 15 * 60 * 1000, // 15分間はキャッシュを保持
  })
}) satisfies UseSession
