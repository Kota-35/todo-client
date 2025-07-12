'use server'

import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import type { z } from 'zod'
import { env } from '../../t3-env/config/_'

export async function makeFetcher<I, O>(
  path: string,
  schema: z.ZodType<O>,
  method: 'GET' | 'POST' = 'GET',
) {
  const fetchFn = async (body: I): Promise<O> => {
    const result = await pipe(
      TE.tryCatch(
        () =>
          fetch(`${env.SERVER_ORIGIN}${path}`, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: method === 'GET' ? undefined : JSON.stringify(body),
          }),
        (e) => new Error(String(e)),
      ),
      TE.chain((res) =>
        res.ok
          ? TE.tryCatch(
              async () => {
                const jsonData = await res.json()
                console.log('Response JSON before validation:', jsonData)
                return jsonData
              },
              () =>
                new Error(`HTTP ${res.status}: レスポンスの解析に失敗しました`),
            )
          : pipe(
              TE.tryCatch(
                () => res.json(),
                () =>
                  new Error(
                    `HTTP ${res.status}: レスポンスの解析に失敗しました`,
                  ),
              ),
              TE.chain((errorJson) => {
                console.error('Server error response:', errorJson)
                return TE.left(
                  new Error(
                    `HTTP ${res.status}: ${
                      errorJson.message || 'サーバーでエラーが発生しました'
                    }`,
                  ),
                )
              }),
            ),
      ),
      TE.chain((json) =>
        TE.fromEither(
          pipe(
            E.tryCatch(
              () => {
                try {
                  const validated = schema.parse(json)
                  console.log('Validation successful:', validated)
                  return validated
                } catch (e) {
                  console.error('Validation error:', e)
                  throw e
                }
              },
              (e) => new Error(String(e)),
            ),
          ),
        ),
      ),
    )()

    if (E.isLeft(result)) {
      throw result.left
    }

    return result.right
  }

  return fetchFn
}
