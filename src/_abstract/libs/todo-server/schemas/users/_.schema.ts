import { z } from 'zod'
import { createApiResponse } from '../common'

/*
type RegisterUserInput struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}
*/
export const AuthRegisterRequest = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string().min(8),
})

/*
type APIResponse struct {
	Success bool                `json:"success"`
	Message string              `json:"message"`
	Data    RegisterUserOutput  `json:"data,omitempty"`
	Error   *ErrorInfo          `json:"error,omitempty"`
}

type RegisterUserOutput struct {
	UserID   string `json:"userId"`
	Email    string `json:"email"`
	Username string `json:"username"`
	Message  string `json:"message"`
}

type ErrorInfo struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Details string `json:"details,omitempty"`
}
*/
const AuthRegisterData = z.object({
  userId: z.string(),
  email: z.string(),
  username: z.string(),
  message: z.string(),
})

export const AuthRegisterResponse = createApiResponse(AuthRegisterData)

export type AuthRegisterRequestType = z.infer<typeof AuthRegisterRequest>
export type AuthRegisterResponseType = z.infer<typeof AuthRegisterResponse>
