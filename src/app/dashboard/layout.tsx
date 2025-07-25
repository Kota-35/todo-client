'use client'

import type { FC, ReactNode } from 'react'
import type { Simplify } from 'type-fest'
import { AuthGuard } from '@/features/authentication/components/AuthGuard'

type Props = Simplify<{
  children: ReactNode
}>

const Layout = (({ children }) => {
  return <AuthGuard>{children}</AuthGuard>
}) satisfies FC<Props>

export default Layout
