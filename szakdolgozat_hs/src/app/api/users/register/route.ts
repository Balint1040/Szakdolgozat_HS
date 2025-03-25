import mysql from 'mysql2/promise'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '@/_lib/db'

export async function POST(request: Request) {
  try {
    const { name, email, password , rememberMe} = await request.json()

    if(name){
      if(name.length < 3 || name.length > 20){
        return NextResponse.json({
          message: "A névnek 3 és 20 karakter között kell legyen",
          status: 400
        })
      }
    }

    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s\-.']+$/
    if(!nameRegex.test(name)){
      return NextResponse.json({
        message: "Nem megfelelő névformátum",
        status: 400
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (email && !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Helytelen email formátum' }, { status: 400 })
    }


    const hashedPassword = await bcrypt.hash(password, 10)

    const [result] = await (await pool).execute<mysql.ResultSetHeader>(
      'INSERT INTO User (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    const token = jwt.sign(
      { userId: result.insertId, role: 'guest' },
      process.env.JWT_SECRET!,
      {expiresIn: rememberMe ? '336h' : '24h'}
    )

    const response = NextResponse.json({
      id: result.insertId,
      name,
      email,
      message: 'sikeres',
    })
    

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: rememberMe ? 1209600 * 1000 : 86400 * 1000 
    }

    response.cookies.set('auth_token', token, cookieOptions)


    return response;
  } catch (e) {
    return NextResponse.json(e)
  }
}