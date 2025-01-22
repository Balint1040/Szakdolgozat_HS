import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import products from '../../../ramproducts.json'

declare global {
    var prisma: PrismaClient | undefined;
}
let prisma: PrismaClient;
if (!global.prisma) {
    global.prisma = new PrismaClient();
}
prisma = global.prisma;

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