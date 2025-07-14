'use server'

import {
  type AuthLoginRequestType,
  AuthLoginResponse,
  type AuthLoginResponseType,
  type GetCurrentSessionRequestType,
  SessionValidationResponse,
  type SessionValidationResponseType,
} from '../schemas/sessions'
import {
  type AuthRegisterRequestType,
  AuthRegisterResponse,
  type AuthRegisterResponseType,
} from '../schemas/users'
import {
  type FetcherOptions,
  makeFetcher,
  makeFetcherWithHeaders,
} from './fetcher'

const apiVersion = '/api/v1'

type PostUsersProps = (
  body: AuthRegisterRequestType,
) => Promise<AuthRegisterResponseType>

export const postUsers = (async (body) => {
  const option = {
    path: `${apiVersion}/users`,
    schema: AuthRegisterResponse,
    method: 'POST',
  } satisfies FetcherOptions<AuthRegisterRequestType, AuthRegisterResponseType>

  const fetcher = await makeFetcher<
    AuthRegisterRequestType,
    AuthRegisterResponseType
  >(option)
  return fetcher(body)
}) satisfies PostUsersProps

type PostSessionsProps = (
  body: AuthLoginRequestType,
) => Promise<AuthLoginResponseType>

export const postSessions = (async (body) => {
  const option = {
    path: `${apiVersion}/sessions`,
    schema: AuthLoginResponse,
    method: 'POST',
  } satisfies FetcherOptions<AuthLoginRequestType, AuthLoginResponseType>

  const fetcher = await makeFetcher<
    AuthLoginRequestType,
    AuthLoginResponseType
  >(option)

  return fetcher(body)
}) satisfies PostSessionsProps

// ヘッダー付きのpostSessions（クッキー設定用）
type PostSessionsWithHeadersProps = (
  body: AuthLoginRequestType,
) => Promise<{ data: AuthLoginResponseType; headers: Headers }>

export const postSessionsWithHeaders = (async (body) => {
  const option = {
    path: `${apiVersion}/sessions`,
    schema: AuthLoginResponse,
    method: 'POST',
  } satisfies FetcherOptions<AuthLoginRequestType, AuthLoginResponseType>

  const fetcher = await makeFetcherWithHeaders<
    AuthLoginRequestType,
    AuthLoginResponseType
  >(option)

  return fetcher(body)
}) satisfies PostSessionsWithHeadersProps

// middleware専用のセッション検証関数
type GetSessionsMeForMiddlewareProps = (
  cookieHeader: string,
) => Promise<SessionValidationResponseType>

/**
 * middleware専用のアクセストークンを検証する関数
 * @param cookieHeader - リクエストのCookieヘッダー文字列
 */
export const getSessionsMeForMiddleware = (async (cookieHeader: string) => {
  const options = {
    path: `${apiVersion}/sessions/me`,
    schema: SessionValidationResponse,
    method: 'GET',
    cookieHeader, // クッキーヘッダーを明示的に渡す
  } satisfies FetcherOptions<
    GetCurrentSessionRequestType,
    SessionValidationResponseType
  >

  const fetcher = await makeFetcher<
    GetCurrentSessionRequestType,
    SessionValidationResponseType
  >(options)

  // void型なので空のオブジェクトを渡す
  return fetcher(undefined as GetCurrentSessionRequestType)
}) satisfies GetSessionsMeForMiddlewareProps
