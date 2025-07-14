import z from 'zod'
import { createApiResponse } from '../common'

/*
type AuthenticateUserInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
*/

export const AuthLoginRequest = z.object({
  email: z.string(),
  password: z.string(),
})

// データがない場合のオプション：
// 1. z.object({}) - 空のオブジェクト
// 2. z.unknown() - 任意のデータ
// 3. z.void() - データなし
export const AuthLoginResponse = createApiResponse(z.void())

export type AuthLoginRequestType = z.infer<typeof AuthLoginRequest>
export type AuthLoginResponseType = z.infer<typeof AuthLoginResponse>

export const GetCurrentSessionRequest = z.void()

const GetCurrentSessionData = z.object({
  user: z.object({
    id: z.string(),
    username: z.string(),
    email: z.string(),
    isActive: z.boolean(),
    createdAt: z.string(),
  }),
  token: z.object({
    expiresAt: z.string(),
    issuedAt: z.string(),
  }),
})

export const GetCurrentSessionResponse = createApiResponse(
  GetCurrentSessionData,
)

// middleware用の簡単なセッション検証レスポンス
const SessionValidationData = z.object({
  user: z.object({
    id: z.string(),
    username: z.string(),
    email: z.string(),
    isActive: z.boolean(),
    createdAt: z.string(),
  }),
  // tokenをオプショナルにする（middlewareでは詳細不要）
  token: z
    .object({
      expiresAt: z.string(),
      issuedAt: z.string(),
    })
    .optional(),
})

export const SessionValidationResponse = createApiResponse(
  SessionValidationData,
)
export type SessionValidationResponseType = z.infer<
  typeof SessionValidationResponse
>

export type GetCurrentSessionRequestType = z.infer<
  typeof GetCurrentSessionRequest
>
export type GetCurrentSessionResponseType = z.infer<
  typeof GetCurrentSessionResponse
>
