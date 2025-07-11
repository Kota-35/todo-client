import clsx from 'clsx'

import { RootHeader } from './_components/RootHeader'
import { RootMain } from './_components/RootMain'

export default function Home() {
  return (
    <div
      className={clsx(
        'min-h-screen',
        // 右下方向にグラデーション,
        // [More: https://mai.kosodante.com/tailwindcss-gradation-color/]
        'bg-gradient-to-br',
        'from-blue-50',
        'to-indigo-100',
      )}
    >
      <RootHeader></RootHeader>

      <RootMain></RootMain>
    </div>
  )
}
