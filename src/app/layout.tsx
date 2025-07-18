import type { Metadata } from 'next'

import '@/_abstract/libs/todo-client/styles/globals.css'
import { ThemeProvider } from 'next-themes'
import type { FC, ReactNode } from 'react'
import type { Simplify } from 'type-fest'
import { ReactQueryProvider } from './_providers/ReactQueryProvider'

type Props = Simplify<{
  children: ReactNode
}>

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'Management your tasks',
}

const RootLayout = (({ children }) => {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}) satisfies FC<Props>

export default RootLayout
