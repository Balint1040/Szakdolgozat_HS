import mysql from 'mysql2/promise'
import { NextResponse } from 'next/server'

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

