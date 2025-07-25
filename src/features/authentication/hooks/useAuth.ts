'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export type User = {
  id: string
  email: string
  username: string
}

type LoginData = {
  email: string
  password: string
}

type SignupData = {
  username: string
  email: string
  password: string
}

type AuthResponse = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

type SessionResponse = AuthResponse & {
  authenticated: boolean
  user?: User
}

const QUERY_KEYS = {
  session: ['auth', 'session'] as const,
}

// APIリクエスト関数
const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  return response.json()
}

const signupUser = async (data: SignupData): Promise<AuthResponse> => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  return response.json()
}

const logoutUser = async (): Promise<AuthResponse> => {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  })

  return response.json()
}

const validateSession = async (): Promise<SessionResponse> => {
  const response = await fetch('/api/auth/session', {
    method: 'GET',
    credentials: 'include',
  })

  return response.json()
}

// カスタムフック
export const useSession = () => {
  return useQuery({
    queryKey: QUERY_KEYS.session,
    queryFn: validateSession,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5分間はキャッシュを使用
  })
}

export const useLogin = () => {
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
}

export const useSignup = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      if (data.success) {
        router.push('/auth/login')
      }
    },
  })
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

// ユーザー情報を取得する便利なフック
export const useUser = () => {
  const { data: session } = useSession()
  return {
    user: session?.user,
    isAuthenticated: session?.authenticated ?? false,
    isLoading: false, // useSessionの結果を使用するため
  }
}
