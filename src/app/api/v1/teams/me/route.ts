import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import z from 'zod'
import { stringifyReplaceError } from '@/_abstract/libs/mdn/stringify/stringifyReplaceError'
import { env } from '@/_abstract/libs/t3-env/config'
import { createApiResponse } from '@/_abstract/libs/todo-server/schemas/common'
import { team } from '@/_abstract/libs/todo-server/schemas/teams'

const getMyTeamsResponse = createApiResponse(z.object({ teams: z.array(team) }))

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('__Host-session')

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const response = await fetch(
      new URL('/api/v1/teams/me', env.SERVER_ORIGIN),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `__Host-session=${sessionCookie.value}`,
        },
      },
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch teams' },
        { status: response.status },
      )
    }

    const body = await response.json()
    const parsed = getMyTeamsResponse.parse(body)

    return NextResponse.json({
      success: true,
      message: 'Teams fetched successfully',
      data: { teams: parsed.data?.teams ?? [] },
    })
  } catch (error) {
    console.error(
      'GET /api/v1/teams/me',
      JSON.stringify(error, stringifyReplaceError, 2),
    )
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
