'use server'

import { cookies } from 'next/headers'
import { stringifyReplaceError } from '@/_abstract/libs/mdn/stringify/stringifyReplaceError'
import { env } from '@/_abstract/libs/t3-env/config'
import {
  type LoginData,
  type LoginResponse,
  loginResponse,
} from '@/features/authentication/components/LoginSection/api/_.schema'

export type LoginUser = (data: LoginData) => Promise<LoginResponse>

export const loginUser = (async (params) => {
  const response = await fetch(new URL('/api/v1/sessions', env.SERVER_ORIGIN), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(params),
  }).catch((error) => {
    console.error(
      '[loginUser:',
      JSON.stringify(error, stringifyReplaceError, 2),
    )
    throw error
  })

  const jsonData = await response.json()

  const parsed = loginResponse.parse(jsonData)

  // 新しいアクセストークンを取得した場合、クッキーに保存
  if (parsed.data?.accessToken) {
    const cookieStore = await cookies()
    cookieStore.set('__Host-session', parsed.data.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      expires: new Date(parsed.data.accessTokenExpiresAt),
    })
  }

  // リフレッシュトークンを取得した場合、クッキーに保存
  if (parsed.data?.refreshToken) {
    const cookieStore = await cookies()
    cookieStore.set('__Host-refresh', parsed.data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      expires: new Date(parsed.data.refreshTokenExpiresAt), // 30日後に期限切れ
    })
  }

  return parsed
}) satisfies LoginUser
