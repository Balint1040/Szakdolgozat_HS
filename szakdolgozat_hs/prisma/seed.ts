import { PrismaClient, user_role } from '@prisma/client'
import { parse } from 'csv-parse/sync'
import fs from 'fs'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const productData = fs.readFileSync('./prisma/data/products.csv')
  const imageData = fs.readFileSync('./prisma/data/imageurl.csv')

  const products = parse(productData, {
    columns: true,
    delimiter: ';' 
  })

  const images = parse(imageData, {
    columns: true,
    delimiter: ';' 
  })

  const users = [
    {
      name: "admin",
      email: "admin@admin.admin",
      password: await bcrypt.hash("admin123", 10),
      role: user_role.admin
    },
    {
      name: "guest",
      email: "guest@guest.guest",
      password: await bcrypt.hash("guest123", 10),
      role: user_role.guest
    }
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user
    })
  }

  for (const product of products) {
    await prisma.product.upsert({
      where: { 
        id: parseInt(product.id) 
      },
      update: {
        name: product.name,
        price: parseInt(product.price),
        manufacturer: product.manufacturer,
        categoryId: parseInt(product.categoryId),
        properties: JSON.parse(product.properties)
      },
      create: {
        id: parseInt(product.id),
        name: product.name,
        price: parseInt(product.price),
        manufacturer: product.manufacturer,
        categoryId: parseInt(product.categoryId),
        properties: JSON.parse(product.properties)
      }
    })
  }

  for (const image of images) {
    await prisma.imageurl.upsert({
      where: { 
        id: parseInt(image.id) 
      },
      update: {
        url: image.url,
        productId: parseInt(image.productId)
      },
      create: {
        id: parseInt(image.id),
        url: image.url,
        productId: parseInt(image.productId)
      }
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })