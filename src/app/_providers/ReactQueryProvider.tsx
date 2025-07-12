'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type FC, type ReactNode, useState } from 'react'
import type { Simplify } from 'type-fest'

type Props = Simplify<{
  children: ReactNode
}>

export const ReactQueryProvider = (({ children }) => {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}) satisfies FC<Props>
