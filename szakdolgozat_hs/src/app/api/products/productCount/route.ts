import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/_lib/db'

export async function GET(request: NextRequest) {
  try {

    if(request.headers.get('X-Api-Key') !== process.env.NEXT_PUBLIC_API_KEY){
      return NextResponse.json({ error: 'Hozzáférés megtagadva' }, { status: 403})
    }

    const [rows]: any[] = await (await pool).execute('SELECT COUNT(*) as count FROM product')
    
    const count = rows[0].count
    return NextResponse.json({ count })
    
  } catch (e) {
    return NextResponse.json(e)
  }
}