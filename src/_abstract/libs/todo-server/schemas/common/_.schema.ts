import z from 'zod'

export const ErrorInfo = z.object({
  code: z.string(),
  message: z.string(),
  details: z.string(),
})

export const ApiResponse = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object(),
  error: ErrorInfo,
})

export type ApiResponseType = z.infer<typeof ApiResponse>
export type ErrorInfoType = z.infer<typeof ErrorInfo>
