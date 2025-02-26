import { pool } from "@/_lib/db"
import { ResultSetHeader, RowDataPacket } from "mysql2"
import {Request} from "express"
import { NextResponse, NextRequest } from "next/server"
import jwt from "jsonwebtoken"



export async function GET(req: Request) {
    try {
        const token = req.cookies.get('auth_token')?.value

        if(!token){
            return NextResponse.json({ error: 'nincs hozzaferes' }, { status: 401 })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }


        const [rows] = await (await pool).execute(
            `SELECT 
                ci.id,
                ci.cartId,
                ci.quantity,
                p.name,
                p.price,
                (SELECT url FROM imageurl WHERE productId = p.id LIMIT 1) as url
             FROM cart c 
             JOIN cartItem ci ON c.id = ci.cartId
             JOIN product p ON ci.productId = p.id
             WHERE c.userId = ?`,
            [decoded.userId]
        )


        console.log('Database :', rows)
        return NextResponse.json(rows)
    } catch (e) {
        console.error('Cart fetch error:', e)
        return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get('auth_token')?.value
        if(!token){
            return NextResponse.json({error: "nincs hozzaferes"}, { status: 401 })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
        const {productId, quantity } = await req.json()

        const [isCartExists] = await (await pool).execute(
            'SELECT id FROM cart WHERE userId = ?',
            [decoded.userId]
        )

        let cartId
        if(Array.isArray(isCartExists) && isCartExists.length > 0){
            cartId = (isCartExists as RowDataPacket[])[0].id
        }else{
            const [result] = await (await pool).execute(
                'INSERT INTO cart (userId) VALUES (?)',
                [decoded.userId]
            )
            cartId = (result as ResultSetHeader).insertId
        }

        await (await pool).execute(
            'INSERT INTO cartItem (cartId, productId, quantity) VALUES (?, ?, ?)',
            [cartId, productId, quantity]
        )
        
        return NextResponse.json({ cartId }, { status: 201 })
    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: 'Hiba a term'})
    }
}

export async function DELETE(req: Request){
    try{
        const token = req.cookies.get('auth_token')?.value
        if(!token){
            return NextResponse.json({ error: 'nincs hozzaferes' }, { status: 401 })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
        await (await pool).execute(
            'DELETE FROM cart WHERE userId = 1',
            [decoded.userId]
        )

        return NextResponse.json({ message: 'Meguritve' })
    }catch(e){
        console.error(e)
        return NextResponse.json({ error: 'Hiba a term'})
    }
}

export async function PUT(req: NextRequest) {
    try {
        const token = req.cookies.get('auth_token')?.value
        if(!token) {
            return NextResponse.json({ error: 'Nincs hozzáférés' }, { status: 401 })
        }

        const {id, quantity} = await req.json()

        const [result] = await (await pool).execute(
            'UPDATE cartItem SET quantity = ? WHERE id = ?',
            [quantity, id]
        )

        const updateResult = result as ResultSetHeader
        if (updateResult.affectedRows === 0) {
            return NextResponse.json({ error: 'Cart item not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Quantity updated' })
    } catch (e) {
        console.error('Update error:', e)
        return NextResponse.json({ error: 'Failed to update quantity' }, { status: 500 })
    }
}