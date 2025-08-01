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
import { useSignup } from '@/features/authentication/components/RegisterSection/hooks'

type Props = Simplify<Record<string, unknown>>

export const RegisterSection = (() => {
  const [isRevealPassword, setIsRevealPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signupMutation = useSignup()

  const togglePassword = () => {
    setIsRevealPassword((prevState) => !prevState)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    signupMutation.mutate({ username, email, password })
  }

  return (
    <div
      className={clsx(
        'flex',
        'flex-1',
        'justify-center',
        'max-w-md',
        'mx-auto',
      )}
    >
      <div className={clsx('w-full', 'bg-white', 'rounded-md')}>
        <Card>
          <CardHeader className={clsx('space-y-1', 'text-center')}>
            <CardTitle
              className={clsx('text-gray-900', 'font-bold', 'text-2xl')}
            >
              Sign up
            </CardTitle>
          </CardHeader>

          <CardContent className={clsx('space-y-4')}>
            <form onSubmit={handleSubmit}>
              <div className={clsx('flex', 'flex-col', 'gap-6')}>
                {/* 一般的なエラーメッセージ表示 */}
                {signupMutation.error && (
                  <div
                    className={clsx(
                      'p-4',
                      'bg-red-50',
                      'border',
                      'border-red-200',
                      'rounded-md',
                    )}
                  >
                    <p className={clsx('text-red-800', 'text-sm')}>
                      登録に失敗しました。入力内容を確認してください。
                    </p>
                  </div>
                )}

                <div className={clsx('grid', 'gap-2')}>
                  <Label htmlFor="username" className={clsx('text-gray-900')}>
                    Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Sample"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className={clsx('text-gray-500')}
                  />
                </div>

                <div className={clsx('grid', 'gap-2')}>
                  <Label htmlFor="email" className={clsx('text-gray-900')}>
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="sample@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                      name="password"
                      type={isRevealPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                <CardFooter className={clsx('flex-row-reverse', 'px-0')}>
                  <Button
                    type="submit"
                    disabled={signupMutation.isPending}
                    className={clsx('text-white', 'max-w-md', 'bg-blue-600')}
                  >
                    {signupMutation.isPending ? '登録中...' : 'Sign Up'}
                  </Button>
                </CardFooter>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}) satisfies FC<Props>
