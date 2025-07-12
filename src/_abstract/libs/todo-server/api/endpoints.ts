'use server'

import {
  type AuthRegisterRequestType,
  AuthRegisterResponse,
  type AuthRegisterResponseType,
} from '../schemas/users'
import { makeFetcher } from './fetcher'

export async function postUsers(
  body: AuthRegisterRequestType,
): Promise<AuthRegisterResponseType> {
  const fetcher = await makeFetcher<
    AuthRegisterRequestType,
    AuthRegisterResponseType
  >('/api/v1/users', AuthRegisterResponse, 'POST')
  return fetcher(body)
}
