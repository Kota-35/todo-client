'use client'

import {
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { loginUser } from '@/features/authentication/components/LoginSection/api'
import type {
  LoginData,
  LoginResponse,
} from '@/features/authentication/components/LoginSection/api/_.schema'
import { QUERY_KEYS } from '@/features/authentication/hooks/useAuth'

type UseLogin = () => UseMutationResult<
  LoginResponse,
  Error,
  LoginData,
  unknown
>

export const useLogin = (() => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.success) {
        // セッションキャッシュを無効化

        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.session })
        router.push('/dashboard')
      }
    },
  })
}) satisfies UseLogin
