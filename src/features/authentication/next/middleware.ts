import {
  type NextMiddleware,
  type NextRequest,
  NextResponse,
} from 'next/server'
import { stringifyReplaceError } from '@/_abstract/libs/mdn/stringify/stringifyReplaceError'
import { env } from '@/_abstract/libs/t3-env/config'

const __HOST_SESSION = '__Host-session'
const __HOST_REFRESH = '__Host-refresh'

export const authMiddleware = (async (request, _event) => {
  const sessionCookie = request.cookies.get(__HOST_SESSION)

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/auth/login', request.nextUrl), 303)
  }

  try {
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

    // セッション検証が失敗した場合
    if (!response.ok) {
      console.error(
        '[auth middleware] Session validation failed:',
        response.status,
      )
      return createAuthFailureResponse(request)
    }

    // セッションが有効な場合は次の処理に進む
    return NextResponse.next()
  } catch (error) {
    console.error(
      '[auth middleware]',
      JSON.stringify(error, stringifyReplaceError, 2),
    )
    return createAuthFailureResponse(request)
  }
}) satisfies NextMiddleware

const createAuthFailureResponse = (request: NextRequest) => {
  const response = NextResponse.redirect(
    new URL('/auth/login', request.nextUrl),
    303,
  )

  // __Host-プレフィックスクッキーを正しく削除
  // Logout/_.tsと同じ方法を使用
  response.cookies.set(__HOST_SESSION, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0, // 即座に期限切れにする
  })

  response.cookies.set(__HOST_REFRESH, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0, // 即座に期限切れにする
  })

  return response
}
