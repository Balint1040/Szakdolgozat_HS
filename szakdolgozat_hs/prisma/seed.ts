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
    },
    {
      name:"Kovács Dávid",
      email: "davidszemelyes@davidszemelyes.davidszemelyes",
      password: await bcrypt.hash("david123", 10),
      role: user_role.guest,
      profilePicture: "https://cdn.pixabay.com/photo/2016/03/26/20/35/young-man-1281282_1280.jpg"
    },
    {
      name:"Zsoltika",
      email: "zsoltikaceges@zsoltikaceges.zsoltikaceges",
      password: await bcrypt.hash("zsoltika123", 10),
      role: user_role.guest,
      profilePicture: "https://www.muralunique.com/wp-content/uploads/2023/07/2173-01_mountainous-landscape.jpg"
    },
    {
      name:"Varga Zoltán",
      email: "zolikavagyok@zolikavagyok.zolikavagyok",
      password: await bcrypt.hash("zoltan123", 10),
      role: user_role.guest
    },
    {
      name:"Dóró",
      email: "doro@doro.doro",
      password: await bcrypt.hash("doro123", 10),
      role: user_role.guest,
      profilePicture: "https://media.istockphoto.com/id/1272756535/photo/young-woman-portrait.jpg?s=612x612&w=0&k=20&c=witp4a4Tvt6t7rqkDXZZlb7yxMY6rLOQQlRw5_0gjgo="
    },
    {
      name:"Krisztián",
      email:"krisztian@krisztian.krisztian",
      password: await bcrypt.hash("krisztian123", 10),
      role: user_role.guest,
    },
    {
      name:"Patricia",
      email:"patricia@patricia.patricia",
      password: await bcrypt.hash("patricia123", 10),
      role: user_role.guest,
      profilePicture: "https://static.scientificamerican.com/sciam/cache/file/2AE14CDD-1265-470C-9B15F49024186C10_source.jpg?w=1200"
    }
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user
    })
  }
  
  const reviews = [
    {
      userId: 3,
      rating: 5,
      text: "Szuper gyors szállítás és a termékek pontosan megfelelnek a leírásnak. Az ügyfélszolgálat is segítőkész volt, amikor kérdéseim voltak. Különösen tetszett, hogy az árak versenyképesek. Ajánlom mindenkinek!",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10)
    },
    {
      userId: 3,
      rating: 4,
      text: "Nagyon jó választék, és a termékek minősége is kiemelkedő. Az egyetlen negatívum, hogy a szállítási idő kicsit hosszabb volt, mint vártam. Az ügyfélszolgálat viszont nagyon kedves volt, és segítettek gyorsan.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60)
    },
    {
      userId: 4,
      rating: 3,
      text: "Az árak és a választék rendben vannak, de a weboldal dizájnja kissé elavultnak tűnik. Azért található rajta minden szükséges információ, de egy modernizált felület sokat javítana a felhasználói élményen.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 150)
    },
    {
      userId: 4,
      rating: 4,
      text: "A termékek színvonalasak és jól vannak csomagolva, de a szállítási időn még javítani kellene. Azonban az ügyfélszolgálat gyorsan válaszolt a kérdéseimre, és segítőkész volt, ezért pozitív a véleményem.",
      createdAt: new Date(Date.now())
    },
    {
      userId: 5,
      rating: 5,
      text: "Szuper élmény volt vásárolni! Minden gyorsan és zökkenőmentesen zajlott. Az oldalon könnyen megtaláltam, amit kerestem, és a vásárlás után hamar meg is érkezett a csomag. A termékek minősége is teljesen rendben van!",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 390)
    },
    {
      userId: 5,
      rating: 5,
      text: "Nagyon elégedett vagyok a vásárlással. Minden tökéletesen működik, és az árak is nagyon versenyképesek. Csak javasolnám, hogy a termékleírásokat egy kicsit részletesebben írják meg, de ezen kívül teljesen hibátlan.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 212)
    },
    {
      userId: 6,
      rating: 2,
      text: "A rendelés kicsit bonyolult volt, mivel a weboldal nem volt túl átlátható. A fizetésnél is akadt néhány probléma, de végül sikerült lebonyolítani. Az árak viszont jók, és a termékek minősége sem hagyott kívánnivalót maga után.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21)
    },
    {
      userId: 6,
      rating: 3,
      text: "A választék és az árak jók, de a termékleírások gyakran nem tartalmaznak elegendő részletet a specifikációkról. Ha ezen javítanának, akkor minden tökéletes lenne. Az ügyfélszolgálat viszont gyorsan reagált.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1)
    },
    {
      userId: 7,
      rating: 5,
      text: "Nagyon pozitív tapasztalataim vannak. A vásárlás egyszerű volt, és a csomag gyorsan megérkezett. Az árak is kedvezőek, és minden termék tökéletesen működik. Mindenképpen visszatérek!",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 36)
    },
    {
      userId: 7,
      rating: 4,
      text: "A webshop nagyon jól működik, és a termékek minősége is remek. Azonban a szállítási idő lehetne gyorsabb, mert a vártnál hosszabb időt vett igénybe a csomag megérkezése.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
    },
    {
      userId: 8,
      rating: 4,
      text: "A weboldal nagyon jól navigálható, és a vásárlás is zökkenőmentes volt. Az egyetlen negatívum, hogy a termékek sok esetben gyorsan elfogytak. Remélem, hamarosan feltöltik őket újra.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4)
    },
    {
      userId: 8,
      rating: 5,
      text: "Minden rendben volt a vásárlás során. A termékek pontosan olyanok, mint a leírásban, és gyorsan meg is érkeztek. Az árak is nagyon kedvezőek. Ajánlom mindenkinek, aki számítógép alkatrészeket keres!",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365)
    }
  ]

  for(const review of reviews) {
    await prisma.review.upsert({
      where:{
        id: reviews.indexOf(review) + 1
      },
      update: {},
      create: review
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