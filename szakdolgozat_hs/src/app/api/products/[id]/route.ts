import { NextRequest, NextResponse } from "next/server";
import mysql from 'mysql2/promise'
import { pool } from "@/_lib/db";
export async function GET(
    request: NextRequest,
    context: { params: { id?: string } }
) {


    const params = await context.params
    const id = params.id

    try {

        if (request.headers.get('X-Api-Key') !== process.env.NEXT_PUBLIC_API_KEY) {
            return NextResponse.json({ error: 'Hozzáférés megtagadva' }, { status: 403 })
        }

        const [rows] = await (await pool).execute('SELECT * FROM product INNER JOIN imageurl ON product.id = imageurl.productID WHERE product.id = ?', [id]);


        return NextResponse.json(rows)
    } catch (error) {
        return console.error(error);
    }

}
