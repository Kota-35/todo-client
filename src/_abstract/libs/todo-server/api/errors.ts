// HTTPエラー情報を保持するカスタムエラークラス
export class HttpError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    // biome-ignore lint/suspicious/noExplicitAny: any型だとダメ
    public responseData: any,
    message?: string,
  ) {
    super(message || `HTTP ${status}: ${statusText}`)
    this.name = 'HttpError'
  }
}
