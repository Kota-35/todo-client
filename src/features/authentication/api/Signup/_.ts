'use server'

import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import { postUsers } from '@/_abstract/libs/todo-server/api/endpoints'
import type { AuthRegisterRequestType } from '@/_abstract/libs/todo-server/schemas/users'
import { type FormState, SignupFormSchema } from './_.schema'

type SignupResult = {
  errors?: {
    username?: string[]
    email?: string[]
    password?: string[]
  }
  success?: {
    username: string
    email: string
  }
}

export async function Signup(
  state: FormState,
  formData: FormData,
): Promise<SignupResult> {
  // バリデーション
  const validationFields = SignupFormSchema.safeParse({
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validationFields.success) {
    return {
      errors: validationFields.error.flatten().fieldErrors,
    }
  }

  const { username, email, password } = validationFields.data

  const authReq = {
    username,
    email,
    password,
  } satisfies AuthRegisterRequestType

  // APIリクエストの実行
  return pipe(
    TE.tryCatch(
      () => postUsers(authReq),
      (error) =>
        error instanceof Error
          ? error
          : new Error('登録処理中にエラーが発生しました'),
    ),
    TE.match(
      (error): SignupResult => {
        console.error('Signup error:', error)
        const errorMessage = error.message.includes('HTTP 500')
          ? '現在サーバーが混み合っています。しばらく時間をおいて再度お試しください。'
          : error.message.includes('HTTP 400')
            ? '入力内容に誤りがあります。'
            : error.message.includes('HTTP 409')
              ? 'このメールアドレスまたはユーザー名は既に登録されています。'
              : '登録処理に失敗しました。しばらく時間をおいて再度お試しください。'
        return { errors: { email: [errorMessage] } }
      },
      (data): SignupResult => ({
        success: { username: data.username, email: data.email },
      }),
    ),
  )()
}
