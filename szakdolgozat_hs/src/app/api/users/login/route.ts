import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '@/_lib/db'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()


    const [rows]: any = await (await pool).execute(
      'SELECT * FROM User WHERE email = ?',
      [email]
    )

    const user = rows[0]
    console.log('User:', user)

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return NextResponse.json({ error: 'helytelen jelszo' })
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role }, 
      process.env.JWT_SECRET!, 
      { expiresIn: '1h' }
    )

    const response = NextResponse.json({
      message: 'sikeres',
      user: { id: user.id, name: user.name, email: user.email }
    })

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 *24 *7,
      path: '/',
    })

    return response

  } catch (e) {
    console.error(e)
    return NextResponse.json(e)
  }
}