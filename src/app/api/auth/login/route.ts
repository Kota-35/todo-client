import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import z from 'zod'
import { stringifyReplaceError } from '@/_abstract/libs/mdn/stringify/stringifyReplaceError'
import { postSessionsWithHeaders } from '@/_abstract/libs/todo-server/api/endpoints'
import { HttpError } from '@/_abstract/libs/todo-server/api/errors'
import type { AuthLoginRequestType } from '@/_abstract/libs/todo-server/schemas/sessions'

const loginRequest = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = loginRequest.parse(body)

    const authLoginReq: AuthLoginRequestType = {
      email: validatedData.email,
      password: validatedData.password,
    }

    const { data: response, headers } =
      await postSessionsWithHeaders(authLoginReq)

    if (response.success) {
      // サーバーからのSet-Cookieヘッダーを取得してクッキーを設定
      const setCookieHeader = headers.get('set-cookie')
      if (setCookieHeader) {
        const cookieStore = await cookies()

        // Set-Cookieヘッダーからクッキー情報を解析
        const cookieEntries = setCookieHeader
          .split(',')
          .map((cookie) => cookie.trim())

        for (const cookieEntry of cookieEntries) {
          const [cookiePair, ..._attributes] = cookieEntry.split(';')
          const [name, value] = cookiePair.split('=').map((s) => s.trim())

          // __Host-session と __Host-refresh のみを処理
          if (
            (name === '__Host-session' || name === '__Host-refresh') &&
            value
          ) {
            // __Host- プレフィックスクッキーの標準設定
            cookieStore.set(name, value, {
              httpOnly: true,
              secure: true,
              sameSite: 'lax',
              path: '/',
            })
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: response.message,
      })
    }

    return NextResponse.json(
      {
        success: false,
        message: response.message,
      },
      { status: 401 },
    )
  } catch (error) {
    console.error(
      'POST /api/auth/login',
      JSON.stringify(error, stringifyReplaceError, 2),
    )

    if (error instanceof HttpError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: error.status },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: 'ログインに失敗しました。',
      },
      { status: 500 },
    )
  }
}
