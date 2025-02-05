import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import { pool } from '@/_lib/db'

export async function GET() {
  try {
    const [rows]: any[] = await (await pool).execute('SELECT COUNT(*) as count FROM product')
    
    const count = rows[0].count
    return NextResponse.json({ count })
    
  } catch (e) {
    return NextResponse.json(e)
  }
}