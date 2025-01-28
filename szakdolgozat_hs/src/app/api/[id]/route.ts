import { NextRequest, NextResponse } from "next/server";
import mysql from 'mysql2/promise'



export async function GET(
    request:  NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id
    
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        })      
        
        const query = 'SELECT * FROM product INNER JOIN imageurl ON product.id = imageurl.productID WHERE product.id = ?'
        const [rows] = await connection.execute(query,[id])
        connection.end()
        
        return NextResponse.json(rows)
    } catch (error) {
        return NextResponse.json({
            error: error
        }, { status: 500 })
    }
}