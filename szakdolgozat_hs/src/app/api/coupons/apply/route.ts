import { pool } from "@/_lib/db"
import { NextResponse } from "next/server"


export async function POST(req: Request) {
    try {
        const { code, totalAmount } = await req.json()

        const currentDate = new Date()

        const [coupons] = await (await pool).execute(`
            SELECT * FROM coupon 
            WHERE code = ? 
            AND (expiryDate IS NULL OR expiryDate > ?) 
            AND currentUsage < usageLimit 
            AND minAmount <= ?
        `, [code, currentDate, totalAmount])

        const coupon = coupons[0]

        if (!coupon) {
            return NextResponse.json({ 
                message: "Érvénytelen vagy lejárt kupon" 
            }, { status: 400 })
        }

        return NextResponse.json({
            code: coupon.code,
            discount: coupon.discount
        })

    } catch (e) {
        console.error(e)
    }
}