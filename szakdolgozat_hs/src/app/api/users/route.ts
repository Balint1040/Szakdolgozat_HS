import { NextResponse, NextRequest } from 'next/server'
//import { roleValidationMiddleware } from '@/middleware/roleValidationMiddleware'
import { pool } from '@/_lib/db'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json({ status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {userId: number}

    const [rows] = await (await pool).execute('SELECT * FROM user WHERE ID = ?', [decoded.userId])


    const user = (rows as any[])[0]
    if(!user){
      return NextResponse.json({status: 404})
    }

    return NextResponse.json({
      name: user.name,
      email: user.email
    })
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