import { NextResponse } from "next/server"
import { pool } from "@/_lib/db"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const searchQuery = searchParams.get('kereses')

        if (!searchQuery) {
            return null
        }

        const searchWords = searchQuery.split(' ').map(word => `%${word}%`)
        let filterName = searchWords.map(() => 'product.name LIKE ?').join(' AND ')
        const filterValues = [...searchWords]

        if (searchQuery.toLowerCase().includes('gpu')) {
            filterName = 'product.categoryId = 1'
        }

        if(searchQuery.toLowerCase().includes('cpu') || searchQuery.toLowerCase().includes('proci')) {
            filterName = 'product.categoryId = 2'
        }
        
        if (searchQuery.toLowerCase().includes('motherboard')){
            filterName = 'product.categoryId = 3'
        }

        if (searchQuery.toLowerCase().includes('ram')) {
            filterName = 'product.categoryId = 4'
        }

        const [rows] = await (await pool).execute(`
            SELECT product.*, MIN(imageurl.url) as url 
            FROM product 
            LEFT JOIN imageurl 
            ON product.id = imageurl.productId 
            WHERE ${filterName}
            GROUP BY product.id`, 
            filterValues)
            
        return NextResponse.json(rows)

    } catch (e) {
        console.error(e)
        return NextResponse.json(e)
    }
}