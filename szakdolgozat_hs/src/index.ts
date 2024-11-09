// to run index.ts use: npx tsx src index.ts !! !!
//if you want to use prisma studio use: npx prisma studio


import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

    /*
    CREATE example

    await prisma.user.create({
      data: {
        name: 'Balint',
        email: 'balint@balint.com',
        posts: {
          create: { title: 'Hey' },
        },
        profile: {
          create: { bio: 'Ez vagyok en' },
        },
      },
    })
    */




    //FIND // print
    const allUsers = await prisma.user.findMany({
        include: {
          posts: true,
          profile: true,
        },
      })
      console.dir(allUsers, { depth: null })



    //UPDATE example
    const post = await prisma.post.update({
        where: { id: 1 },
        data: { published: true },
      })
      console.log(post)
  }

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })