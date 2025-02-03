import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    const [rows]: any[] = await connection.execute('SELECT COUNT(*) as count FROM product')
    await connection.end()

    const count = rows[0].count
    return NextResponse.json({ count })
    
  } catch (e) {
    return NextResponse.json(e)
  }
}