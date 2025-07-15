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

  //クッキーを削除
  cookieStore.delete('__Host-session')
  cookieStore.delete('__Host-refresh')
  redirect('/')
}) satisfies LogoutAction
