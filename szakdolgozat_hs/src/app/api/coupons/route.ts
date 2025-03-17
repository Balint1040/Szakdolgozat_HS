import { NextResponse } from "next/server"
import { pool } from "@/_lib/db"


export async function GET() {
    try {
        const [coupons] = await (await pool).execute(`SELECT * FROM coupon`)

        return NextResponse.json(coupons)
    } catch (e) {
        console.error(e)
    }
}


export async function POST(req: Request) {
    try {
        const { code, discount, minAmount, expiryDate, usageLimit } = await req.json()

        await (await pool).execute(`
            INSERT INTO coupon (code, discount, minAmount, expiryDate, usageLimit, currentUsage) 
            VALUES (?, ?, ?, ?, ?, 0)
        `, [code, discount, minAmount, expiryDate || null, usageLimit])

        return NextResponse.json({ 
            message: "Kupon sikeresen létrehozva",
            coupon: { code, discount, minAmount, expiryDate, usageLimit }
        }, { status: 201 })

    } catch (e) {
        console.error(e)
    }
}


export async function DELETE(req: Request) {
    try {
        const { code } = await req.json()

        await (await pool).execute(`DELETE FROM coupon WHERE code = ?`, [code])

        return NextResponse.json({status: 204})
    } catch (e) {
        console.error(e)
    }
}

