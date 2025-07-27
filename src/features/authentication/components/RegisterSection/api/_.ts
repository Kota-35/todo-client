'use server'

import { env } from '@/_abstract/libs/t3-env/config'
import {
  type SignupData,
  type SignupResponse,
  signupResponse,
} from '@/features/authentication/components/RegisterSection/api/_.schema'

export type SignupUser = (data: SignupData) => Promise<SignupResponse>

export const signupUser = (async (data) => {
  const response = await fetch(new URL('/api/v1/users', env.SERVER_ORIGIN), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  const jsonData = await response.json()

  return signupResponse.parse(jsonData)
}) satisfies SignupUser
