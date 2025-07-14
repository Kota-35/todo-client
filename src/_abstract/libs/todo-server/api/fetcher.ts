'use server'

import type { z } from 'zod'
import { stringifyReplaceError } from '../../mdn/stringify/stringifyReplaceError'
import { env } from '../../t3-env/config/_'

type HttpMethod = 'GET' | 'POST'
export type FetcherOptions<_I, O> = {
  path: string
  schema: z.ZodType<O>
  method?: HttpMethod
}

type Fetcher<I, O> = (body: I) => Promise<O>
type FetcherFactory = <I, O>(
  options: FetcherOptions<I, O>,
) => Promise<Fetcher<I, O>>

export const makeFetcher = (async <I, O>({
  path,
  schema,
  method = 'GET',
}: FetcherOptions<I, O>): Promise<Fetcher<I, O>> => {
  return async (body: I): Promise<O> => {
    // 1. APIリクエストの実行
    const response = await fetch(`${env.SERVER_ORIGIN}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: method === 'GET' ? undefined : JSON.stringify(body),
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
      if (response.status === 409) {
        console.error(
          `makeFetcher HTTP ${response.status}:`,
          JSON.stringify(jsonData, stringifyReplaceError, 2),
        )
      }
      throw new Error(
        `HTTP ${response.status}, ${JSON.stringify(jsonData, stringifyReplaceError, 2)}`,
      )
    }

    // 4. スキーマバリデーション
    try {
      const validated = schema.parse(jsonData)
      return validated
    } catch (error: unknown) {
      console.error(
        'makeFetcher jsonData:',
        JSON.stringify(error, stringifyReplaceError, 2),
      )
      throw error
    }
  }
}) satisfies FetcherFactory
