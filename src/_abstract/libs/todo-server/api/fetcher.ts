'use server'

import type { z } from 'zod'
import { stringifyReplaceError } from '../../mdn/stringify/stringifyReplaceError'
import { env } from '../../t3-env/config/_'
import { HttpError } from './errors'

type HttpMethod = 'GET' | 'POST'
export type FetcherOptions<_I, O> = {
  path: string
  schema: z.ZodType<O>
  method?: HttpMethod
  // middleware用のクッキーヘッダーを追加
  cookieHeader?: string
}

type Fetcher<I, O> = (body: I) => Promise<O>
type FetcherWithHeaders<I, O> = (
  body: I,
) => Promise<{ data: O; headers: Headers }>
type FetcherFactory = <I, O>(
  options: FetcherOptions<I, O>,
) => Promise<Fetcher<I, O>>
type FetcherWithHeadersFactory = <I, O>(
  options: FetcherOptions<I, O>,
) => Promise<FetcherWithHeaders<I, O>>

export const makeFetcher = (async <I, O>({
  path,
  schema,
  method = 'GET',
  cookieHeader,
}: FetcherOptions<I, O>): Promise<Fetcher<I, O>> => {
  return async (body: I): Promise<O> => {
    // ヘッダーを構築
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // クッキーヘッダーがある場合は追加
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader
    }

    // 1. APIリクエストの実行
    const response = await fetch(`${env.SERVER_ORIGIN}${path}`, {
      method,
      headers,
      body: method === 'GET' ? undefined : JSON.stringify(body),
      // middleware内でのfetchではcredentialsを明示的に指定
      credentials: cookieHeader ? 'include' : 'same-origin',
    }).catch((error) => {
      // ネトワークエラーやサーバーの接続が失敗した際のエラー
      // レスポンスすれ受け取れない
      console.error(
        'makeFetcher response:',
        JSON.stringify(error, stringifyReplaceError, 2),
      )
      throw error
    })

    // 2. レスポンスのJSONパース
    const jsonData = await response.json().catch((error) => {
      console.error(
        'makeFetcher jsonData:',
        JSON.stringify(error, stringifyReplaceError, 2),
      )
      throw error
    })

    // 3. エラーハンドリング
    if (!response.ok) {
      console.error('Server error response:', jsonData)
      // HTTPエラーの詳細情報をカスタムエラーとして投げる
      throw new HttpError(
        response.status,
        response.statusText,
        jsonData,
        `HTTP ${response.status}: ${response.statusText}`,
      )
    }

    // 4. スキーマバリデーション
    try {
      const validated = schema.parse(jsonData)
      return validated
    } catch (error: unknown) {
      console.error(
        'Schema validation failed. Received data:',
        JSON.stringify(jsonData, null, 2),
      )
      console.error(
        'makeFetcher jsonData:',
        JSON.stringify(error, stringifyReplaceError, 2),
      )
      throw error
    }
  }
}) satisfies FetcherFactory

export const makeFetcherWithHeaders = (async <I, O>({
  path,
  schema,
  method = 'GET',
  cookieHeader,
}: FetcherOptions<I, O>): Promise<FetcherWithHeaders<I, O>> => {
  return async (body: I): Promise<{ data: O; headers: Headers }> => {
    // ヘッダーを構築
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // クッキーヘッダーがある場合は追加
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader
    }

    // 1. APIリクエストの実行
    const response = await fetch(`${env.SERVER_ORIGIN}${path}`, {
      method,
      headers,
      body: method === 'GET' ? undefined : JSON.stringify(body),
      // middleware内でのfetchではcredentialsを明示的に指定
      credentials: cookieHeader ? 'include' : 'same-origin',
    }).catch((error) => {
      // ネトワークエラーやサーバーの接続が失敗した際のエラー
      // レスポンスすれ受け取れない
      console.error(
        'makeFetcherWithHeaders response:',
        JSON.stringify(error, stringifyReplaceError, 2),
      )
      throw error
    })

    // 2. レスポンスのJSONパース
    const jsonData = await response.json().catch((error) => {
      console.error(
        'makeFetcherWithHeaders jsonData:',
        JSON.stringify(error, stringifyReplaceError, 2),
      )
      throw error
    })

    // 3. エラーハンドリング
    if (!response.ok) {
      console.error('Server error response:', jsonData)
      // HTTPエラーの詳細情報をカスタムエラーとして投げる
      throw new HttpError(
        response.status,
        response.statusText,
        jsonData,
        `HTTP ${response.status}: ${response.statusText}`,
      )
    }

    // 4. スキーマバリデーション
    try {
      const validated = schema.parse(jsonData)
      return {
        data: validated,
        headers: response.headers,
      }
    } catch (error: unknown) {
      console.error(
        'makeFetcherWithHeaders jsonData:',
        JSON.stringify(error, stringifyReplaceError, 2),
      )
      throw error
    }
  }
}) satisfies FetcherWithHeadersFactory
