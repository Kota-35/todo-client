'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { stringifyReplaceError } from '@/_abstract/libs/mdn/stringify/stringifyReplaceError'
import { env } from '@/_abstract/libs/t3-env/config'
import type { LogoutActionSchema } from './_.schema.ts'

type LogoutActionParams = LogoutActionSchema

type LogoutAction = (params: LogoutActionParams) => Promise<never>

export const logoutAction = (async () => {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('__Host-session')

  if (!sessionCookie) {
    redirect('/')
  }

  // サーバーにログアウトリクエストを送信
  const _ = await fetch(new URL('/sessions', env.SERVER_ORIGIN), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `__Host-session:${sessionCookie}`,
    },
  }).catch((error) => {
    console.error(
      'logoutAction',
      JSON.stringify(error, stringifyReplaceError, 2),
    )
  })

  // __Host-プレフィックスクッキーを正しく削除
  // __Host-クッキーには特定のセキュリティ属性が必要
  cookieStore.set('__Host-session', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0, // 即座に期限切れにする
  })

  cookieStore.set('__Host-refresh', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0, // 即座に期限切れにする
  })

  redirect('/')
}) satisfies LogoutAction
