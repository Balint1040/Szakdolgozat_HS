import { NextResponse, NextRequest } from 'next/server'
import { roleValidationMiddleware } from '@/middleware/roleValidationMiddleware'
import { pool } from '@/_lib/db'

export async function GET(request: NextRequest) {
  try {
    const middlewareResponse = await roleValidationMiddleware(request)
    if (middlewareResponse) {
      return middlewareResponse
    }

    const [rows] = await (await pool).execute('SELECT * FROM user')

    return NextResponse.json(rows)
  } catch (e) {
    console.error(e)
    return NextResponse.json(e)
  }
}