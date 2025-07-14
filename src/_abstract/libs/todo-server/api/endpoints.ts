'use server'

import {
  type AuthRegisterRequestType,
  AuthRegisterResponse,
  type AuthRegisterResponseType,
} from '../schemas/users'
import { type FetcherOptions, makeFetcher } from './fetcher'

type PostUsersProps = (
  body: AuthRegisterRequestType,
) => Promise<AuthRegisterResponseType>

export const postUsers = (async (body) => {
  const option = {
    path: '/api/v1/users',
    schema: AuthRegisterResponse,
    method: 'POST',
  } satisfies FetcherOptions<AuthRegisterRequestType, AuthRegisterResponseType>

  const fetcher = await makeFetcher<
    AuthRegisterRequestType,
    AuthRegisterResponseType
  >(option)
  return fetcher(body)
}) satisfies PostUsersProps
