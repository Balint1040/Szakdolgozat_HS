import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '@/_lib/db'

export async function POST(req: Request) {
  try {
    const existingToken = (await cookies()).get('auth_token')

    if(existingToken){
      try{
        jwt.verify(existingToken.value, process.env.JWT_SECRET!)
        return NextResponse.json({ message: 'már be vagy jelentkezve' })
      }catch{
      
      }
    }

    const { email, password, rememberMe } = await req.json()

    if(!email || !password){
      return NextResponse.json({
        message: "Email és jelszó megadása kötelező", status: 400
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!emailRegex.test(email)){
      return NextResponse.json({
        message: "Érvénytelen email formátum", status: 400
      })
    }


    const [rows]: any = await (await pool).execute(
      'SELECT * FROM User WHERE email = ?',
      [email]
    )

    if (!rows || (rows as any[]).length === 0) {
      return NextResponse.json({ 
        message: "Helytelen email cím vagy jelszó", status: 401, autoHideDuration: 2000
      })
    }

    const user = rows[0]

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return NextResponse.json({ error: "Helytelen jelszó", status: 401 })
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role }, 
      process.env.JWT_SECRET!, 
      { expiresIn: rememberMe ? '336h' : '24h'}
    )

    const response = NextResponse.json({
      message: 'sikeres',
      user: { id: user.id, name: user.name, email: user.email }
    })

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: rememberMe ? 1209600 * 1000 : 86400 * 1000,
      path: '/',
    })

    return response

  } catch (e) {
    console.error(e)
    return NextResponse.json(e)
  }
}