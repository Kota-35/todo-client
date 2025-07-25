'use server'

import { cookies } from 'next/headers'
import type { z } from 'zod'
import { stringifyReplaceError } from '../../mdn/stringify/stringifyReplaceError'
import { env } from '../../t3-env/config/_'

type HttpMethod = 'GET' | 'POST'

export type FetcherOptions<_I, O> = {
  path: string
  responseBody: z.ZodType<O>
  method: HttpMethod
}

const apiVersion = '/api/v1'

type Fetcher<I, O> = (body: I) => Promise<O>

type FetcherFactory = <I, O>(
  options: FetcherOptions<I, O>,
) => Promise<Fetcher<I, O>>

export const makeFetcher = (async <I, O>({
  path,
  responseBody,
  method,
}: FetcherOptions<I, O>): Promise<Fetcher<I, O>> => {
  return async (body: I): Promise<O> => {
    // Cookieからアクセストークンを自動取得
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('__Host-session')?.value

    if (!accessToken) {
      throw new Error('認証が必要です')
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    }

    // 1. APIリクエストの実行
    const response = await fetch(
      new URL(`${apiVersion}${path}`, env.SERVER_ORIGIN),
      {
        method,
        credentials: 'include',
        headers: headers,
        body: method === 'GET' ? undefined : JSON.stringify(body),
      },
    ).catch((error) => {
      // ネトワークエラーやサーバーの接続が失敗した際のエラー
      // レスポンスすれ受け取れない
      console.error(
        'makeFetcher response:',
        JSON.stringify(error, stringifyReplaceError, 2),
      )
      throw error
    })

    const jsonData = await response.json().catch((error) => {
      console.error(
        'makeFetcher jsonData:',
        JSON.stringify(error, stringifyReplaceError, 2),
      )
      throw error
    })

    return responseBody.parse(jsonData)
  }
}) satisfies FetcherFactory
