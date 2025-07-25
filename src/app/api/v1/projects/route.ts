import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import z from 'zod'
import { stringifyReplaceError } from '@/_abstract/libs/mdn/stringify/stringifyReplaceError'
import { env } from '@/_abstract/libs/t3-env/config'
import { createApiResponse } from '@/_abstract/libs/todo-server/schemas/common'
import { project } from '@/_abstract/libs/todo-server/schemas/projects'

const createProjectRequest = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  color: z.string().default('#3b82f6'),
  teamId: z.string(),
})

const createProjectResponse = createApiResponse(project)

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('__Host-session')

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createProjectRequest.parse(body)

    const response = await fetch(
      new URL('/api/v1/projects', env.SERVER_ORIGIN),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `__Host-session=${sessionCookie.value}`,
        },
        body: JSON.stringify(validatedData),
      },
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: response.status },
      )
    }

    const responseBody = await response.json()
    const parsed = createProjectResponse.parse(responseBody)

    return NextResponse.json(parsed)
  } catch (error) {
    console.error(
      'POST /api/v1/projects',
      JSON.stringify(error, stringifyReplaceError, 2),
    )
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
