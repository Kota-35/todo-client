'use server'

import { cookies } from 'next/headers'
import { stringifyReplaceError } from '@/_abstract/libs/mdn/stringify/stringifyReplaceError'
import { env } from '@/_abstract/libs/t3-env/config'
import {
  type RefreshSessionResponse,
  refreshSessionResponse,
  type ValidateSessionResponse,
  validateSessionResponse,
} from '@/features/authentication/components/AuthGuard/api/_.schema'

export type ValidateSession = () => Promise<ValidateSessionResponse>

export const validateSession = (async () => {
  // クッキーからアクセストークンを取得
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('__Host-session')?.value

  if (!accessToken) {
    console.error('アクセストークンの取得に失敗')
    throw new Error('No access token found')
  }

  const response = await fetch(
    new URL('/api/v1/sessions/me', env.SERVER_ORIGIN),
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    },
  ).catch((error) => {
    console.error(
      'セッションの確認に失敗',
      JSON.stringify(error, stringifyReplaceError, 2),
    )
    throw error
  })

  const jsonData = await response.json()
  return validateSessionResponse.parse(jsonData)
}) satisfies ValidateSession

export type RefreshSession = () => Promise<RefreshSessionResponse>

export const refreshSession = (async () => {
  const response = await fetch(
    new URL('/api/v1/sessions/refresh', env.SERVER_ORIGIN),
    {
      method: 'POST',
      credentials: 'include',
    },
  ).catch((error) => {
    console.error(
      'セッションのリフレッシュに失敗',
      JSON.stringify(error, stringifyReplaceError, 2),
    )

    throw error
  })

  const jsonData = await response.json()

  const parsed = refreshSessionResponse.parse(jsonData)

  // リフレッシュで新しいアクセストークンを取得した場合、クッキーに保存
  if (parsed.data?.accessToken) {
    const cookieStore = await cookies()
    cookieStore.set('__Host-session', parsed.data.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      expires: new Date(parsed.data.AccessTokenExpiresAt),
    })
  }

  return parsed
}) satisfies RefreshSession
