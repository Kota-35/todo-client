'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

type AuthResponse = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

export const QUERY_KEYS = {
  session: ['auth', 'session'] as const,
}

const logoutUser = async (): Promise<AuthResponse> => {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  })

  return response.json()
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // 全てのキャッシュをクリア
      queryClient.clear()
      router.push('/')
    },
  })
}
