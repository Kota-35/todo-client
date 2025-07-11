'use client'

import clsx from 'clsx'
import { Eye, EyeOff } from 'lucide-react'
import { type FC, useState } from 'react'
import type { Simplify } from 'type-fest'
import { Button } from '@/_abstract/libs/todo-client/components/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/_abstract/libs/todo-client/components/card'
import { Input } from '@/_abstract/libs/todo-client/components/input'
import { Label } from '@/_abstract/libs/todo-client/components/label'

type Props = Simplify<Record<string, unknown>>

export const RegisterSection = (() => {
  // FYI; パスワードの表示/非表示切り替え
  // [More: https://zenn.dev/dove/articles/cd1eb343a9e76bcd2066]
  const [isRevealPassword, setIsRevealPassword] = useState(false)

  const togglePassword = () => {
    setIsRevealPassword((prevState) => !prevState)
  }

  return (
    <div
      className={clsx(
        // 子要素をフレックスボックスに設定
        'flex',
        'flex-1',
        // フレックスボックスの子要素を水平方向の中心に設定
        'justify-center',
        'max-w-md',
        'mx-auto',
      )}
    >
      <div className={clsx('w-full', 'bg-white')}>
        <Card>
          <CardHeader className={clsx('space-y-1', 'text-center')}>
            <CardTitle
              className={clsx('text-gray-900', 'font-bold', 'text-2xl')}
            >
              Sign up
            </CardTitle>
          </CardHeader>

          <CardContent className={clsx('space-y-4')}>
            <form>
              <div className={clsx('flex', 'flex-col', 'gap-6')}>
                <div className={clsx('grid', 'gap-2')}>
                  <Label htmlFor="email" className={clsx('text-gray-900')}>
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="sample@example.com"
                    required
                    className={clsx('text-gray-500')}
                  />
                </div>

                <div className={clsx('grid', 'gap-2')}>
                  <Label htmlFor="password" className={clsx('text-gray-900')}>
                    Password
                  </Label>
                  <div className={clsx('relative')}>
                    <Input
                      id="password"
                      type={isRevealPassword ? 'text' : 'password'}
                      placeholder="Password"
                      required
                      className={clsx('text-gray-500', 'pr-10')}
                    />
                    <button
                      type="button"
                      onClick={togglePassword}
                      className={clsx(
                        'absolute',
                        'right-4',
                        'top-1/2',
                        '-translate-y-1/2',
                        'cursor-pointer',
                      )}
                    >
                      {isRevealPassword ? (
                        <Eye className={clsx('text-gray-300', 'h-5', 'w-5')} />
                      ) : (
                        <EyeOff
                          className={clsx('text-gray-300', 'h-5', 'w-5')}
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>

          <CardFooter className={clsx('flex-row-reverse')}>
            <Button
              type="submit"
              className={clsx('text-while', 'max-w-md', 'bg-blue-600')}
            >
              Sign Up
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}) satisfies FC<Props>
