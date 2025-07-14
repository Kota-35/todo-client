'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import z from 'zod'
import { stringifyReplaceError } from '@/_abstract/libs/mdn/stringify/stringifyReplaceError'
import { postSessionsWithHeaders } from '@/_abstract/libs/todo-server/api/endpoints'
import { HttpError } from '@/_abstract/libs/todo-server/api/errors'
import type { AuthLoginRequestType } from '@/_abstract/libs/todo-server/schemas/sessions'
import { LoginFormSchema, type LoginFormState } from './_.schema'

type LoginProps = (
  state: LoginFormState,
  fromData: FormData,
) => Promise<LoginFormState>

// HTTPステータスコードに応じたエラーメッセージを取得する関数
const getErrorMessage = (error: HttpError): string => {
  switch (error.status) {
    case 401:
      // 認証エラー（メールアドレスまたはパスワードが間違っている）
      if (error.responseData?.error?.message) {
        return error.responseData.error.message
      }
      return 'メールアドレスまたはパスワードが間違っています。'
    case 400:
      // バリデーションエラー
      if (error.responseData?.error?.message) {
        return error.responseData.error.message
      }
      return '入力内容に不備があります。確認してください。'
    case 404:
      return 'ユーザーが見つかりません。'
    case 429:
      return 'ログイン試行回数が上限に達しました。しばらく時間をおいて再度お試しください。'
    case 500:
      return 'サーバーエラーが発生しました。しばらく時間をおいて再度お試しください。'
    case 503:
      return 'サービスが一時的に利用できません。しばらく時間をおいて再度お試しください。'
    default:
      return `ログインに失敗しました。(エラーコード: ${error.status})`
  }
}

export const Login = (async (_, formData) => {
  // バリデーション
  const validationFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validationFields.success) {
    return {
      errors: z.flattenError(validationFields.error).fieldErrors,
    }
  }

  const { email, password } = validationFields.data

  const authLoginReq = {
    email: email,
    password: password,
  } satisfies AuthLoginRequestType

  try {
    const { data: response, headers } =
      await postSessionsWithHeaders(authLoginReq)

    // ログインしたら自分のダッシュボードページにリダイレクト
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
          const [cookiePair, ...attributes] = cookieEntry.split(';')
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

      redirect('/dashboard')
    }

    return {
      message: response.message,
    }
  } catch (error) {
    // Next.jsのredirect制御フローを再スロー
    if (
      error instanceof Error &&
      (error.message === 'NEXT_REDIRECT' ||
        (error as any).__NEXT_ERROR_CODE === 'E394')
    ) {
      throw error
    }

    console.error(
      'Login error',
      JSON.stringify(error, stringifyReplaceError, 2),
    )

    // HttpErrorの場合は詳細なエラーメッセージを返す
    if (error instanceof HttpError) {
      return {
        message: getErrorMessage(error),
      }
    }

    // その他のエラー（ネットワークエラーなど）
    return {
      message:
        'ネットワークエラーが発生しました。インターネット接続を確認してください。',
    }
  }
}) satisfies LoginProps
