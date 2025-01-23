import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    const [rows] = await connection.execute('SELECT * FROM product INNER JOIN imageurl ON product.id = imageurl.productID')

    await connection.end()

    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error fetching data:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
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
        console.error(e);
    }
}

*/