'use server'

import {
  type AuthRegisterRequestType,
  AuthRegisterResponse,
  type AuthRegisterResponseType,
} from '../schemas/users'
import { type FetcherOptions, makeFetcher } from './fetcher'

export async function postUsers(
  body: AuthRegisterRequestType,
): Promise<AuthRegisterResponseType> {
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
}
