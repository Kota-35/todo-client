'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { stringifyReplaceError } from '@/_abstract/libs/mdn/stringify/stringifyReplaceError'
import { postUsers } from '@/_abstract/libs/todo-server/api/endpoints'
import { HttpError } from '@/_abstract/libs/todo-server/api/errors'
import type { AuthRegisterRequestType } from '@/_abstract/libs/todo-server/schemas/users'
import { SignupFormSchema, type SignupFormState } from './_.schema'

type SignupProps = (
  state: SignupFormState,
  formData: FormData,
) => Promise<SignupFormState>

// HTTPステータスコードに応じたエラーメッセージを取得する関数
const getErrorMessage = (error: HttpError): string => {
  switch (error.status) {
    case 409:
      // コンフリクトエラー（ユーザー名またはメールアドレスが既に存在）
      if (error.responseData?.error?.message) {
        return error.responseData.error.message
      }
      return 'このユーザー名またはメールアドレスは既に使用されています。'
    case 400:
      // バリデーションエラー
      if (error.responseData?.error?.message) {
        return error.responseData.error.message
      }
      return '入力内容に不備があります。確認してください。'
    case 500:
      return 'サーバーエラーが発生しました。しばらく時間をおいて再度お試しください。'
    case 503:
      return 'サービスが一時的に利用できません。しばらく時間をおいて再度お試しください。'
    default:
      return `登録に失敗しました。(エラーコード: ${error.status})`
  }
}

export const Signup = (async (_, formData) => {
  // バリデーション
  const validationFields = SignupFormSchema.safeParse({
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validationFields.success) {
    return {
      errors: z.flattenError(validationFields.error).fieldErrors,
    }
  }

  const { username, email, password } = validationFields.data

  const authReq = {
    username,
    email,
    password,
  } satisfies AuthRegisterRequestType

  try {
    // APIリクエストの実行
    const response = await postUsers(authReq)

    // 登録したらリダイレクト
    if (response.success) {
      redirect('/auth/login')
    }

    // APIからのエラーレスポンスの場合
    return {
      message: response.error?.message || '登録に失敗しました。',
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
      'Signup error:',
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
}) satisfies SignupProps
