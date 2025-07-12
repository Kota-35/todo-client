import { z } from 'zod'

/*
type CreateRequest struct {
	Email     string `json:"email" binding:"required"`
	Username  string `json:"username" binding:"required"`
	Password  string `json:"password" binding:"required"`
}
*/
export const AuthRegisterRequest = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string().min(8),
})

/*
type AuthResponse struct {
	Token     string    `json:"token"`
	ExpiresAt time.Time `json:"expires_at"`
	UserID    string    `json:"user_id"`
	Email     string    `json:"email"`
	Username  string    `json:"username"`
} 
*/
export const AuthRegisterResponse = z.object({
  token: z.string(),
  expiresAt: z.string(),
  userId: z.uuidv4(),
  email: z.string(),
  username: z.string(),
})

export type AuthRegisterRequestType = z.infer<typeof AuthRegisterRequest>
export type AuthRegisterResponseType = z.infer<typeof AuthRegisterResponse>
