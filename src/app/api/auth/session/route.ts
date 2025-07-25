import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { stringifyReplaceError } from '@/_abstract/libs/mdn/stringify/stringifyReplaceError'
import { env } from '@/_abstract/libs/t3-env/config'

export async function GET(_: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('__Host-session')

    if (!sessionCookie) {
      return NextResponse.json(
        {
          success: false,
          message: 'セッションが見つかりません。',
          authenticated: false,
        },
        { status: 401 },
      )
    }

    const response = await fetch(
      new URL('/api/v1/sessions/me', env.SERVER_ORIGIN),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `__Host-session=${sessionCookie.value}`,
        },
        credentials: 'include',
      },
    )

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json({
        success: true,
        message: 'セッションが有効です。',
        authenticated: true,
        user: data.data,
      })
    }

    return NextResponse.json(
      {
        success: false,
        message: 'セッションが無効です。',
        authenticated: false,
      },
      { status: 401 },
    )
  } catch (error) {
    console.error(
      'GET /api/auth/session',
      JSON.stringify(error, stringifyReplaceError, 2),
    )

    return NextResponse.json(
      {
        success: false,
        message: 'セッション検証に失敗しました。',
        authenticated: false,
      },
      { status: 500 },
    )
  }
}
