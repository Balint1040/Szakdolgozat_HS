import { NextRequest, NextResponse } from 'next/server'
import mysql, {ResultSetHeader} from 'mysql2/promise'
import { pool } from '@/_lib/db'
//import { roleValidationMiddleware } from '@/middleware/roleValidationMiddleware'


export async function GET(request: NextRequest) {
  try {
    
    if (request.headers.get('X-Api-Key') !== process.env.NEXT_PUBLIC_API_KEY) {
      return NextResponse.json({ error: 'Hozzáférés megtagadva' }, { status: 403 })
  }
    
    const [rows] = await (await pool).execute('SELECT p.id, p.name, p.price, p.properties, p.manufacturer, p.categoryId, i.url AS imageUrl FROM product p LEFT JOIN ImageUrl i ON p.id = i.productId WHERE i.url = (SELECT MIN(url) FROM ImageUrl WHERE productId = p.id) ORDER BY p.id')

    return NextResponse.json(rows)
  } catch (e) {
    console.error(e)
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