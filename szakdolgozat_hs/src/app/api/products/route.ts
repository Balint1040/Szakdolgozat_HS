import { NextRequest, NextResponse } from 'next/server'
import {ResultSetHeader} from 'mysql2/promise'
import { pool } from '@/_lib/db'
//import { roleValidationMiddleware } from '@/middleware/roleValidationMiddleware'


export async function GET(request: NextRequest) {
  try {
    if (request.headers.get('X-Api-Key') !== process.env.NEXT_PUBLIC_API_KEY) {
      return NextResponse.json({ error: 'Hozzáférés megtagadva' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const categoryId = searchParams.get('categoryId')
    const manufacturer = searchParams.get("manufacturer")
    
    let query = `
      SELECT p.*, i.url AS imageUrl 
      FROM product p 
      LEFT JOIN ImageUrl i ON p.id = i.productId 
      AND i.url = (SELECT MIN(url) FROM ImageUrl WHERE productId = p.id) 
      WHERE 1=1
    `
    const params: any[] = []

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
    if(manufacturer){
      const manufacturers = manufacturer.split(',')
      query += `AND p.manufacturer IN (${manufacturers.map(() => "?").join(",")})`
      params.push(...manufacturers)
    }


    query += ` ORDER BY p.id`

    const [rows] = await (await pool).execute(query, params)

    return NextResponse.json(rows)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, price, properties, manufacturer, categoryId, imageUrls } = await request.json()

    const [result] = await (await pool).execute(
      'INSERT INTO product (name, price, properties, manufacturer, categoryId) VALUES (?, ?, ?, ?, ?)',
      [name, price, properties, manufacturer, categoryId]
    )

    const productId = (result as ResultSetHeader).insertId

    for (const imageUrl of imageUrls) {
      await (await pool).execute(
        'INSERT INTO imageurl (productId, url) VALUES (?, ?)',
        [productId, imageUrl]
      )
    }

    return NextResponse.json({ message: 'added' }, { status: 201 })
  } catch (e) {
    console.error(e)
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()

    await (await pool).execute('DELETE FROM imageurl WHERE productId = ?', [id])

    await (await pool).execute('DELETE FROM product WHERE id = ?', [id])

    return NextResponse.json({ message: 'deleted' })
  } catch (e) {
    console.error(e)
  }
}



/* DB product seed
export default async function Page(req: NextApiRequest, res: NextApiResponse) {
    try {
        for (const product of products) {
            await prisma.product.create({
                data: {
                    name: product.name,
                    price: parseInt(product.price.replace(/\s+/g, '')),
                    properties: product.properties,
                    manufacturer: product.manufacturer,
                    imageUrls: {
                        create: product.image_urls.map((url: string) => ({
                            url
                        }))
                    }
                }
            });
        }
        res.status(200).json({ message: 'Seed succes' });
    } catch (e) {
        console.error(e)
    }
}

*/