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

        const [rows] = await (await pool).execute('SELECT * FROM product LEFT JOIN imageurl ON product.id = imageurl.productID WHERE product.id = ?', [id]);


        return NextResponse.json(rows)
    } catch (error) {
        return console.error(error);
    }

}

export async function PUT(request: NextRequest, context: { params: { id?: string } }) {
    try {
  
      const params = await context.params
      const id = params.id
  
      const { name, price, properties, manufacturer, categoryId } = await request.json()
  
      await (await pool).execute(
        'UPDATE product SET name = ?, price = ?, properties = ?, manufacturer = ?, categoryId = ? WHERE id = ?',
        [name, price, properties, manufacturer, categoryId, id]
      )
  
      return NextResponse.json({ message: 'updated' }, { status: 200 })
    } catch (e) {
      console.error(e)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
  }