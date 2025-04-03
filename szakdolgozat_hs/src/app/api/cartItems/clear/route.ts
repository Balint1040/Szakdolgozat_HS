import { pool } from "@/_lib/db"
import { NextRequest, NextResponse } from "next/server"
import jwt from 'jsonwebtoken'

export async function DELETE(req: NextRequest) {
    try {
        const token = req.cookies.get('auth_token')?.value
        if(!token) {
            return NextResponse.json({ status: 401 })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }

        await (await pool).execute(
            'DELETE ci FROM cartItem ci JOIN cart c ON ci.cartId = c.id WHERE c.userId = ?',
            [decoded.userId]
        )

        return NextResponse.json({ message: 'Kosár kiürítve' }, {status: 200})
    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: 'Kosár kiürítése nem sikerült' }, { status: 500 })
    }
}