import { pool } from "@/_lib/db"
import { NextRequest, NextResponse } from "next/server"
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('auth_token')?.value
        if(!token){
            return NextResponse.json({ message: "Nem vagy bejelentkezve", status: 401 })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
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
            WHERE review.userId = ?
            ORDER BY review.createdAt DESC`, 
            [decoded.userId])

        return NextResponse.json(rows)
    } catch (e) {
        console.error(e)
        return NextResponse.json({ message: e, status: 500 })
    }
}