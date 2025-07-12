/**
 * Error オブジェクトを JSON.stringifyで文字列化する際に、
 * JSON.stringify()の第２引数を使って置き換える関数
 *
 *
 * @example
 * ```ts
 * const error = new Error('error message')
 * const json = JSON.stringify(error, stringifyReplaceError)
 * console.log(json)
 * ```
 */
export const stringifyReplaceError = (_key: string, value: unknown) => {
  if (value instanceof Error) {
    const error = {} as Record<string, unknown>
    // for ofを使って形に変換する
    for (const name of Object.getOwnPropertyNames(value)) {
      error[name] = value[name as keyof Error]
    }

    return error
  }

  return value
}
