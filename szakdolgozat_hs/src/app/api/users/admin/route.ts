import { pool } from "@/_lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {

    const [rows] = await (await pool).execute('SELECT id, name, email, role FROM user')

    return NextResponse.json(rows)
  } catch (e) {
    console.error(e)
    return NextResponse.json(e)
  }
}


export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()

    await (await pool).execute('DELETE FROM user WHERE id = ?', [id])

    return NextResponse.json({ message: 'deleted' })
  } catch (e) {
    console.error(e)
  }
}