import type { NextMiddleware } from 'next/server'
import { authMiddleware } from '@/features/authentication/next/middleware'

export const config = {
  // 認証が必要なルートのみを指定
  matcher: [
    '/dashboard/:path*',
    // 将来的に他の保護が必要なルートがあればここに追加
  ],
}

const middleware = (async (request, event) => {
  const authResponse = await authMiddleware(request, event)

  if (authResponse.status === 303) {
    return authResponse
  }
}) satisfies NextMiddleware

export default middleware
