import { pool } from "@/_lib/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
    try {
        const [rows] = await (await pool).execute(`
            SELECT 
                review.id,
                review.rating,
                review.text,
                review.createdAt,
                review.userId,
                user.name
            FROM review 
            LEFT JOIN user ON review.userId = user.id
            ORDER BY review.createdAt DESC`
          )

        return NextResponse.json(rows)
    } catch (e) {
        console.error(e)
        return NextResponse.json({ message: e, status: 500 })
    }
}

export async function POST(req: NextRequest) {
  try {
      const token = req.cookies.get('auth_token')?.value
      if (!token) {
          return NextResponse.json({ message: "Nem vagy bejelentkezve", status: 401 })
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }

      const { rating, text } = await req.json()

      if (!rating || !text) {
          return NextResponse.json({ message: "Mindkettő mező kitöltése kötelező", status: 400 })
      }

      await (await pool).execute(`
          INSERT INTO review (userId, rating, text, createdAt)
          VALUES (?, ?, ?, NOW())`, [decoded.userId, rating, text])

      return NextResponse.json({ message: "Sikeresen hozzáadva", status: 200 })
  } catch (e) {
      return NextResponse.json({ message: e, status: 500 })
  }
}

export async function DELETE(req: NextRequest){
  try{
    const token = req.cookies.get('auth_token')?.value
    if(!token){
      return NextResponse.json({ message: "Nem vagy bejelentkezve", status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }

    const {searchParams} = new URL(req.url)
    const reviewId = searchParams.get('id')

    await (await pool).execute(
      'DELETE FROM review WHERE id = ? AND userId = ?', 
      [reviewId, decoded.userId]
    )

    return NextResponse.json({ status: 200 })
  }catch(e){
    console.error(e)
    return NextResponse.json({ message: e, status: 500 })
  }
}