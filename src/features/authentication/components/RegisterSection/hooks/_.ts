import { type UseMutationResult, useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {
  type SignupData,
  type SignupResponse,
  signupUser,
} from '@/features/authentication/components/RegisterSection/api'

export type UseSignup = () => UseMutationResult<
  SignupResponse,
  Error,
  SignupData,
  unknown
>

export const useSignup = (() => {
  const router = useRouter()

  return useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      if (data.success) {
        router.push('/auth/login')
      }
    },
  })
}) satisfies UseSignup
