import { NextResponse } from 'next/server'
import mysql, {ResultSetHeader} from 'mysql2/promise'

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


    return NextResponse.json({ message: 'succes get' }, { status: 201 })
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