import { type NextRequest, NextResponse } from 'next/server'
import z from 'zod'
import { stringifyReplaceError } from '@/_abstract/libs/mdn/stringify/stringifyReplaceError'
import { postUsers } from '@/_abstract/libs/todo-server/api/endpoints'
import { HttpError } from '@/_abstract/libs/todo-server/api/errors'
import type { AuthRegisterRequestType } from '@/_abstract/libs/todo-server/schemas/users'

const signupRequest = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: '8文字以上である必要があります' })
    .regex(/[a-zA-Z]/, { message: '少なくとも1つの英文字を含めてください' })
    .regex(/[0-9]/, { message: '少なくとも1つの数字を含めてください' })
    .regex(/[^a-zA-Z0-9]/, {
      message: '少なくとも1つの記号(特殊文字)を含めてください',
    }),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = signupRequest.parse(body)

    const authReq: AuthRegisterRequestType = {
      username: validatedData.username,
      email: validatedData.email,
      password: validatedData.password,
    }

    const response = await postUsers(authReq)

    if (response.success) {
      return NextResponse.json({
        success: true,
        message: response.message,
      })
    }

    return NextResponse.json(
      {
        success: false,
        message: response.error?.message || '登録に失敗しました。',
      },
      { status: 400 },
    )
  } catch (error) {
    console.error(
      'POST /api/auth/signup',
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

    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors
      return NextResponse.json(
        {
          success: false,
          message: 'バリデーションエラーが発生しました。',
          errors: fieldErrors,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message:
          'ネットワークエラーが発生しました。インターネット接続を確認してください。',
      },
      { status: 500 },
    )
  }
}
