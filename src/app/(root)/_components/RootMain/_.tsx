'use client'

import clsx from 'clsx'
import { CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { FC } from 'react'
import type { Simplify } from 'type-fest'
import { Button } from '@/_abstract/libs/todo-client/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/_abstract/libs/todo-client/components/card'

type Props = Simplify<Record<string, unknown>>

export const RootMain = (() => {
  const router = useRouter()

  return (
    <main
      className={clsx(
        // フレックスコンテナ内でこの要素が利用可能な空きスペースをすべて使用するように拡大
        // 親要素の残りのスペースをすべて埋めるために使用
        'flex-1',
        // 子要素をフレックスコンテナとして扱えるようにする
        'flex',
        // フレックスコンテナ内の子要素を垂直方向の中央に配置
        // align-items: center
        'items-center',
        // フレックスコンテナ内の子要素を水平方向の中央に配置
        // justify-content: center
        'justify-center',
        'px-4',
        'py-8',
      )}
    >
      <div
        className={clsx(
          // 要素の幅を親要素の100%に設定
          'w-full',
          // 要素の最大幅を4xl（56rem = 896px）に制限
          'max-w-4xl',
          // グリッドコンテナとして設定（display: grid）
          'grid',
          // md（768px）以上の画面幅で2列のグリッドレイアウトを適用
          'md:grid-cols-2',
          // グリッドアイテム間の間隔を8（2rem = 32px）に設定
          'gap-8',
          // グリッドコンテナ内の子要素を垂直方向の中央に配置
          'items-center',
        )}
      >
        {/*左側: アプリ紹介部分*/}
        <div
          className={clsx(
            // 子要素に垂直方向のスペース
            'space-y-6',
          )}
        >
          {/*見出し*/}
          <div
            className={clsx(
              // 子要素の垂直方向のスペース
              'space-y-4',
            )}
          >
            <h2
              className={clsx(
                'text-4xl',
                'font-bold',
                'text-gray-900',
                // テキスト要素の行の高さを狭くする
                'leading-tight',
              )}
            >
              シンプルで効率的な
              <br />
              <span className={clsx('text-blue-600')}>タスク管理</span>
            </h2>
            <p className={clsx('text-lg', 'text-gray-600')}>
              日々のタスクを整理し、生産性を向上させましょう。
              直感的なインターフェースで、誰でも簡単にはじめれれます。
            </p>
          </div>

          <div
            className={clsx(
              // 子要素に垂直方向のスペース
              'space-y-4',
            )}
          >
            <div
              className={clsx(
                // コンテナをフレックスボックスとして設定
                'flex',
                // 子要素を垂直方向のセンターに配置
                'items-center',
                // 子要素の水平方向にスペース
                'space-x-3',
              )}
            >
              <CheckCircle className={clsx('h-5', 'h-6', 'text-green-500')} />
              <span className={clsx('text-gray-700')}>
                タスクの追加・編集・削除
              </span>
            </div>

            <div
              className={clsx(
                // コンテナをフレックスボックスとして設定
                // コンテナをフレックスボックスとして設定
                'flex',
                // 子要素を垂直方向のセンターに配置
                'items-center',
                // 子要素の水平方向にスペース
                'space-x-3',
              )}
            >
              <CheckCircle className={clsx('h-5', 'h-6', 'text-green-500')} />
              <span className={clsx('text-gray-700')}>進捗情報の整理</span>
            </div>

            <div
              className={clsx(
                // コンテナをフレックスボックスとして設定
                // コンテナをフレックスボックスとして設定
                'flex',
                // 子要素を垂直方向のセンターに配置
                'items-center',
                // 子要素の水平方向にスペース
                'space-x-3',
              )}
            >
              <CheckCircle className={clsx('h-5', 'h-6', 'text-green-500')} />
              <span className={clsx('text-gray-700')}>カテゴリ列の整理</span>
            </div>

            <div
              className={clsx(
                // コンテナをフレックスボックスとして設定
                // コンテナをフレックスボックスとして設定
                'flex',
                // 子要素を垂直方向のセンターに配置
                'items-center',
                // 子要素の水平方向にスペース
                'space-x-3',
              )}
            >
              <CheckCircle className={clsx('h-5', 'h-6', 'text-green-500')} />
              <span className={clsx('text-gray-700')}>クラウド同期対応</span>
            </div>
          </div>
        </div>

        {/* 右側: 認証ボタン */}
        <div
          className={clsx(
            'w-full',
            // 	最大幅: 28rem
            'max-w-md',
            // 要素の左右のマージンを自動的に均等に設定
            // 最大幅に制限されたコンテナを画面の中央に配置することができる
            'mx-auto',
            // 背景を白に
            'bg-white',
            // 角を丸める
            'rounded-md',
          )}
        >
          <Card>
            <CardHeader
              className={clsx(
                // 水平方向にスペース
                'space-y-1',
                // テキストを中心に配置
                'text-center',
              )}
            >
              <CardTitle className={clsx('text-2xl', 'text-gray-900')}>
                始めましょう
              </CardTitle>
              <CardDescription className={clsx('text-gray-600')}>
                アカウントを作成するか、既存のアカウントでログインしてください
              </CardDescription>
            </CardHeader>

            <CardContent className={clsx('space-y-4')}>
              <Button
                className={clsx('w-full', 'h-12', 'text-lg', 'bg-black')}
                onClick={() => router.push('/auth/signup')}
              >
                新規登録
              </Button>

              <Button
                className={clsx(
                  'w-full',
                  'h-12',
                  'text-lg',
                  'bg-transparent',
                  'text-gray-500',
                )}
                variant="outline"
                onClick={() => router.push('/auth/login')}
              >
                ログイン
              </Button>
            </CardContent>

            <CardFooter className={clsx('text-center')}>
              <p className={clsx('text-sm', 'text-gray-600')}>
                登録は無料で、すぐに始められます
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}) satisfies FC<Props>
