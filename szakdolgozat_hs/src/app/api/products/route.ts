import { NextRequest, NextResponse } from 'next/server'
import mysql, {ResultSetHeader} from 'mysql2/promise'
import { pool } from '@/_lib/db'
import { roleValidationMiddleware } from '@/middleware/roleValidationMiddleware'


export async function GET(request: NextRequest) {
  try {
    const middlewareResponse = await roleValidationMiddleware(request)
    if (middlewareResponse) {
      return middlewareResponse
    }
    
    const [rows] = await (await pool).execute('SELECT p.id, p.name, p.price, p.properties, p.manufacturer, p.categoryId, i.url AS imageUrl FROM product p LEFT JOIN ImageUrl i ON p.id = i.productId WHERE i.url = (SELECT MIN(url) FROM ImageUrl WHERE productId = p.id) ORDER BY p.id')

    return NextResponse.json(rows)
  } catch (error) {
    console.error(error)
  }
}


export async function POST(request: Request) {
  try {
    const { name, price, properties, manufacturer, categoryId, imageUrls } = await request.json();

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    })

    const [result] = await connection.execute(
      'INSERT INTO product (name, price, properties, manufacturer, categoryId) VALUES (?, ?, ?, ?, ?)',
      [name, price, properties, manufacturer, categoryId]
    )

    const productId = (result as ResultSetHeader).insertId;

    for (const imageUrl of imageUrls) {
      await connection.execute(
        'INSERT INTO imageurl (productId, url) VALUES (?, ?)',
        [productId, imageUrl]
      );
    }

    await connection.end()

    return NextResponse.json({ message: 'added' }, { status: 201 })
  } catch (error) {
    console.error(error)
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