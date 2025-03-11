import { NextResponse, NextRequest } from 'next/server'
//import { roleValidationMiddleware } from '@/middleware/roleValidationMiddleware'
import { pool } from '@/_lib/db'

export async function GET(request: NextRequest) {
  try {
    
    const [rows] = await (await pool).execute('SELECT id, name, email, role FROM user')
    
    return NextResponse.json(rows)
  } catch (e) {
    console.error(e)
    return NextResponse.json(e)
  }
}
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()

    await (await pool).execute('DELETE FROM user WHERE id = ?', [id])

    return NextResponse.json({ message: 'deleted' })
  } catch (e) {
    console.error(e)
  }
}


export async function POST() {
  const res = NextResponse.json({ status: 200})
  res.cookies.delete('auth_token')
  
  return res
}