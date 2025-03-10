import { NextResponse } from "next/server"
import { pool } from "@/_lib/db"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const searchQuery = searchParams.get('kereses')
        const categoryId = searchParams.get('categoryId')
        const minPrice = searchParams.get('minPrice')
        const maxPrice = searchParams.get('maxPrice')
        const manufacturer = searchParams.get('manufacturer')

        let query = `
        SELECT p.*, i.url AS imageUrl 
        FROM product p 
        LEFT JOIN ImageUrl i ON p.id = i.productId 
        AND i.url = (SELECT MIN(url) FROM ImageUrl WHERE productId = p.id) 
        WHERE 1=1
      `
        const params: any[] = []
        
        if (searchQuery) {
            const searchWords = searchQuery.split(' ')
            searchWords.forEach(word => {
                query += ` AND LOWER(p.name) LIKE ?`
                params.push(`%${word}%`)
            })
        }

        if (minPrice) {
            query += ` AND p.price >= ?`
            params.push(minPrice)
        }

        if (maxPrice) {
            query += ` AND p.price <= ?`
            params.push(maxPrice)
        }

        if (categoryId) {
            const categoryIds = categoryId.split(',').map(id => parseInt(id, 10))
            query += ` AND p.categoryId IN (${categoryIds.map(() => '?').join(',')})`
            params.push(...categoryIds)
        }

        if (manufacturer) {
            const manufacturers = manufacturer.split(',')
            query += ` AND p.manufacturer IN (${manufacturers.map(() => "?").join(",")})`
            params.push(...manufacturers)
        }

        query += ` ORDER BY p.id`

        const [rows] = await (await pool).execute(query, params)
            
        return NextResponse.json(rows)

    } catch (e) {
        console.error(e)
        return NextResponse.json(e)
    }
}