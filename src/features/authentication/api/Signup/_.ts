'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { stringifyReplaceError } from '@/_abstract/libs/mdn/stringify/stringifyReplaceError'
import { postUsers } from '@/_abstract/libs/todo-server/api/endpoints'
import type { AuthRegisterRequestType } from '@/_abstract/libs/todo-server/schemas/users'
import { SignupFormSchema, type SignupFormState } from './_.schema'

type SignupProps = (
  state: SignupFormState,
  formData: FormData,
) => Promise<SignupFormState>

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

  // APIリクエストの実行
  const response = await postUsers(authReq).catch((error) => {
    console.error(
      'Signup error:',
      JSON.stringify(error, stringifyReplaceError, 2),
    )
    throw error
  })

  // 登録したらリダイレクト
  if (response.success) {
    redirect('/auth/login')
  }

  // APIからのエラーレスポンスの場合
  return {
    message: response.error?.message || '登録に失敗しました。',
  }
}) satisfies SignupProps
