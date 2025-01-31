import { NextResponse } from "next/server"
import mysql from 'mysql2/promise'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const searchQuery = searchParams.get('kereses')

        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        })

        const [rows] = await connection.execute(`
            SELECT product.*, imageurl.url 
            FROM product 
            LEFT JOIN imageurl 
            ON product.id = imageurl.productId 
            WHERE product.name LIKE ?`, 
            [`%${searchQuery}%`])

        await connection.end()

        return NextResponse.json(rows)

    } catch (error) {
        console.error(error);
    }
}
