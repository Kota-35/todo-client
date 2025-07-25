import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { stringifyReplaceError } from '@/_abstract/libs/mdn/stringify/stringifyReplaceError'
import { env } from '@/_abstract/libs/t3-env/config'

export async function POST(_: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('__Host-session')

    if (sessionCookie) {
      // サーバーにログアウトリクエストを送信
      await fetch(new URL('/sessions', env.SERVER_ORIGIN), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `__Host-session:${sessionCookie.value}`,
        },
      }).catch((error) => {
        console.error(
          'logout server request',
          JSON.stringify(error, stringifyReplaceError, 2),
        )
      })
    }

    // __Host-プレフィックスクッキーを正しく削除
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

    return NextResponse.json({
      success: true,
      message: 'ログアウトしました。',
    })
  } catch (error) {
    console.error(
      'POST /api/auth/logout',
      JSON.stringify(error, stringifyReplaceError, 2),
    )

    return NextResponse.json(
      {
        success: false,
        message: 'ログアウトに失敗しました。',
      },
      { status: 500 },
    )
  }
}
