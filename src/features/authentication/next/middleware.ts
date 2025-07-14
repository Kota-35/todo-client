import { type NextMiddleware, NextResponse } from 'next/server'

import { getSessionsMeForMiddleware } from '@/_abstract/libs/todo-server/api/endpoints'

const __HOST_SESSION = '__Host-session'

export const authMiddleware = (async (request, _event) => {
  const sessionCookie = request.cookies.get(__HOST_SESSION)

  if (!sessionCookie) {
    console.log('セッションクッキーが見つかりません')
    return NextResponse.redirect(new URL('/auth/login', request.nextUrl), 303)
  }

  try {
    const cookieHeader = request.headers.get('cookie') || ''
    const isValid = await validSession(cookieHeader)
    if (!isValid) {
      console.log('セッションが無効です')
      const response = NextResponse.redirect(
        new URL('/auth/login', request.nextUrl),
        303,
      )
      response.cookies.delete(__HOST_SESSION)
      return response
    }

    // セッションが有効な場合は次の処理に進む
    console.log('セッションが有効です')
    return NextResponse.next()
  } catch (error) {
    console.error('セッション検証中にエラーが発生しました:', error)
    const response = NextResponse.redirect(
      new URL('/auth/login', request.nextUrl),
      303,
    )
    response.cookies.delete(__HOST_SESSION)
    return response
  }
}) satisfies NextMiddleware

type ValidSessionProps = (cookieHeader: string) => Promise<boolean>

const validSession = (async (cookieHeader) => {
  // サーバーに対してセッションの有効性を確認
  const response = await getSessionsMeForMiddleware(cookieHeader)
  return response.success
}) satisfies ValidSessionProps
