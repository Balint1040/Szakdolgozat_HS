import mysql from 'mysql2/promise'
import { NextResponse } from 'next/server'


export async function GET() {
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      });
  
      const [rows] = await connection.execute('SELECT * FROM user')
  
      await connection.end()
  
      return NextResponse.json(rows)
    } catch (error) {
      console.error(error)
    }
  }

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json()
        const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        });

        const [result] = await connection.execute<mysql.ResultSetHeader>(
        'INSERT INTO User (name, email, password) VALUES (?, ?, ?)',
        [name, email, password]
        )

        await connection.end();

        return NextResponse.json({ id: result.insertId, name, email, password })
    } catch (error) {
        console.error(error)
        return NextResponse.json(error)
    }
}

