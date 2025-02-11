import { NextRequest, NextResponse } from "next/server";
import mysql from 'mysql2/promise'
import { pool } from "@/_lib/db";
import { roleValidationMiddleware } from "@/middleware/roleValidationMiddleware";

export async function GET(
    request:  NextRequest,
    context: { params: { id?: string } }
) {

    const middlewareResponse = await roleValidationMiddleware(request)
    if (middlewareResponse) {
        return middlewareResponse
    }
    
    
    const params = await context.params
    const id = params.id
    
    try {

        const [rows] = await (await pool).execute('SELECT * FROM product INNER JOIN imageurl ON product.id = imageurl.productID WHERE product.id = ?', [id]);
        
        return NextResponse.json(rows)
    } catch (error) {
        return console.error(error);
    }
}
