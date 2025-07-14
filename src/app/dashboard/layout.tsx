import type { FC, ReactNode } from 'react'
import type { Simplify } from 'type-fest'

type Props = Simplify<{
  children: ReactNode
}>

const Layout = (({ children }) => {
  return <div>{children}</div>
}) satisfies FC<Props>

export default Layout
