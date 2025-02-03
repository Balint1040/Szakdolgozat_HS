import mysql from 'mysql2/promise'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import next from 'next'


export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    })

    const [rows] = await connection.execute('SELECT * FROM user')

    await connection.end()

    return NextResponse.json(rows)
  } catch (error) {
    console.error(error)
  }
}

export async function POST(request: Request, res: Response) {
  try {
    const { name, email, password } = await request.json()
    const hashedPassword = await bcrypt.hash(password, 10)

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    })

    const [result] = await connection.execute<mysql.ResultSetHeader>(
      'INSERT INTO User (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    )

    await connection.end()

    return NextResponse.json({ id: result.insertId, name, email, hashedPassword })
  } catch (error) {
    console.error(error)
    return NextResponse.json(error)
  }
}
/*
export async function login(req: Request){
  try{
    const { email, password } = await req.json()

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    })

    const [rows] = await connection.execute('SELECT * FROM user WHERE email = ?', [email])


    return NextResponse.json(rows)
  }catch(e){
    return NextResponse.json(e)
  }
}
*/