import type { Metadata } from 'next'

import '@/_abstract/libs/todo-client/styles/globals.css'
import { ThemeProvider } from 'next-themes'
import type { FC, ReactNode } from 'react'
import type { Simplify } from 'type-fest'

type Props = Simplify<{
  children: ReactNode
}>

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'Management your tasks',
}

const RootLayout = (({ children }) => {
  return (
    // FYI: next-themes はhtml要素を直接更新する（classやstyleを付与）ため、
    //      何もしないとReactのハイドレーション不一致の警告が出てしまいます。
    //      suppressHydrationWarning はこの警告を無視するための指定です。
    <html lang="ja" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}) satisfies FC<Props>

export default RootLayout
