import { object, string } from 'zod'

export const SignupFormSchema = object({
  username: string().trim(),
  email: string().trim(),
  password: string()
    .min(8, { message: '8文字以上である必要があります' })
    .regex(/[a-zA-Z]/, { message: '少なくとも1つの英文字を含めてください' })
    .regex(/[0-9]/, { message: '少なくとも1つの数字を含めてください' })
    .regex(/[^a-zA-Z0-9]/, {
      message: '少なくとも1つの記号(特殊文字)を含めてください',
    })
    .trim(),
})

export type FormState =
  | {
      errors?: {
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined
