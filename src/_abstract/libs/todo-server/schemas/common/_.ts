import z from 'zod'
import { ErrorInfo } from './_.schema.ts'

type CreateApiResponseProps = <T extends z.ZodType>(dataSchema: T) => z.ZodType
export const createApiResponse = ((dataSchema) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: dataSchema.optional(),
    error: ErrorInfo.optional(),
  })) satisfies CreateApiResponseProps
