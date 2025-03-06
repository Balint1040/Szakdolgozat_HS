import mysql from 'mysql2/promise'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '@/_lib/db'

export async function POST(request: Request) {
  try {
    const { name, email, password , rememberMe} = await request.json()

    const hashedPassword = await bcrypt.hash(password, 10)

    const [result] = await (await pool).execute<mysql.ResultSetHeader>(
      'INSERT INTO User (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    const token = jwt.sign(
      { userId: result.insertId, role: 'guest' },
      process.env.JWT_SECRET!,
     {expiresIn: '336h'}
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
      maxAge: rememberMe ? 1209600 : undefined 
    }

    response.cookies.set('auth_token', token, cookieOptions)


    return response;
  } catch (e) {
    return NextResponse.json(e)
  }
}