import { NextResponse } from "next/server"
import mysql from 'mysql2/promise'

export async function GET(request: Request) {
    try {

        const { searchParams } = new URL(request.url)
        const searchQuery = searchParams.get('kereses')

        if (!searchQuery) {
            return null
        }

        const searchWords = searchQuery.split(' ').map(word => `%${word}%`)
        const filterConditions = searchWords.map(() => 'product.name LIKE ?').join(' AND ')

        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        })

        const [rows] = await connection.execute(`
            SELECT product.*, MIN(imageurl.url) as url 
            FROM product 
            LEFT JOIN imageurl 
            ON product.id = imageurl.productId 
            WHERE ${filterConditions}
            GROUP BY product.id`, 
            searchWords)
            
        await connection.end()
        
        return NextResponse.json(rows)

    } catch (e) {
        console.error(e)
        return NextResponse.json(e)
    }
}