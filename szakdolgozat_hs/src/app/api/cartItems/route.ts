import { pool } from "@/_lib/db"
import { ResultSetHeader } from "mysql2"
import { NextRequest, NextResponse } from "next/server"
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
    try {
        const { cartId, productId, quantity } = await req.json()
        
        const [result] = await (await pool).execute(
            'INSERT INTO cartItem (cartId, productId, quantity) VALUES (?, ?, ?)',
            [cartId, productId, quantity]
        )

        const itemId = (result as ResultSetHeader).insertId
        return NextResponse.json({ itemId }, { status: 201 })
    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: 'Hiba a termék kosárba helyezésekor' }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const { productId, quantity } = await req.json()

        const [existingItem] = await (await pool).execute(
            'SELECT id, quantity FROM cartItem WHERE productId = ?',
            [productId]
        )

        if (Array.isArray(existingItem) && existingItem.length > 0) {
            await (await pool).execute(
                'UPDATE cartItem SET quantity = ? WHERE productId = ?',
                [quantity, productId]
            )
        }

        return NextResponse.json({ message: 'Quantity updated successfully' })
    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: 'Failed to update quantity' }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json()
        const productId = body.productId

        await (await pool).execute(
            'DELETE FROM cartItem WHERE id = ?',
            [productId]
        )

        return NextResponse.json({ message: 'Termék törölve a kosárból' })
    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: 'Hiba a termék törlésekor' }, { status: 500 })
    }
}


export async function PATCH(req: NextRequest) {
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

        return NextResponse.json({ message: 'Kosár kiürítve!' })
    } catch (e) {
        console.error(e)
        return NextResponse.json({ status: 500 })
    }
}