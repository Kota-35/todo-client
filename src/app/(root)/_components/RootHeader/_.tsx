import clsx from 'clsx'
import { ListTodo } from 'lucide-react'
import type { FC } from 'react'
import type { Simplify } from 'type-fest'

type Props = Simplify<Record<string, unknown>>

export const RootHeader = (() => {
  return (
    <header
      className={clsx(
        'w-full', // width: 100%;
        // FYI: padding-inlineとpadding-block
        //      インライン方向とブロック方向
        //      - インライン方向: 文章の進行方向
        //      - ブロック方向: 文章の垂直方向
        // [More: https://web-kiso.com/css-padding/]
        'py-6', // padding-block: calc(var(--spacing) * <number>);
        'px-4', // padding-inline: calc(var(--spacing) * <number>);
      )}
    >
      <div
        className={clsx(
          // コンテナの最大幅を72rem（1152px）に制限します
          // max-width: var(--container-6xl); /* 72rem (1152px) */
          'max-w-6xl',
          // 要素の左右のマージンを自動的に均等に設定
          // 最大幅に制限されたコンテナを画面の中央に配置することができる
          'mx-auto',
          // [More: https://tailwindcss.com/docs/flex]
          'flex', // コンテナをflexboxとして設定
          'items-center', // 子要素を垂直方向の中央に配置
          'justify-between', // 子要素を水平方向に均等に分散配置
        )}
      >
        <div
          className={clsx(
            'flex',
            'items-center',
            'space-x-2', // 子要素に水平方向のスペース
          )}
        >
          <ListTodo className={clsx('h-8', 'w-8', 'text-blue-600')}></ListTodo>
          <h1 className={clsx('text-gray-900', 'text-2xl', 'font-bold')}>
            TodoApp
          </h1>
        </div>
      </div>
    </header>
  )
}) satisfies FC<Props>
