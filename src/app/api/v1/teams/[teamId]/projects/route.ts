import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import z from 'zod'
import { stringifyReplaceError } from '@/_abstract/libs/mdn/stringify/stringifyReplaceError'
import { env } from '@/_abstract/libs/t3-env/config'
import { createApiResponse } from '@/_abstract/libs/todo-server/schemas/common'
import { project } from '@/_abstract/libs/todo-server/schemas/projects'

const getTeamProjectsResponse = createApiResponse(
  z.object({ projects: z.array(project) }),
)

export async function GET(
  _: NextRequest,
  { params }: { params: { teamId: string } },
) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('__Host-session')

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { teamId } = await params

    const response = await fetch(
      new URL(`/api/v1/teams/${teamId}/projects`, env.SERVER_ORIGIN),
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
        { error: 'Failed to fetch projects' },
        { status: response.status },
      )
    }

    const body = await response.json()
    const parsed = getTeamProjectsResponse.parse(body)

    return NextResponse.json({
      success: true,
      message: 'Projects fetched successfully',
      data: { projects: parsed.data?.projects ?? [] },
    })
  } catch (error) {
    console.error(
      'GET /api/v1/teams/[teamId]/projects',
      JSON.stringify(error, stringifyReplaceError, 2),
    )
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
