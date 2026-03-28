import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = [
    { name: 'Food', color: '#ff6b6b' },
    { name: 'Travel', color: '#4dabf7' },
    { name: 'Bills', color: '#fcc419' },
    { name: 'Shopping', color: '#20c997' },
    { name: 'Entertainment', color: '#b197fc' },
    { name: 'Health', color: '#ff8787' },
    { name: 'Other', color: '#ced4da' },
  ]

  console.log(`Start seeding...`)
  for (const c of categories) {
    const category = await prisma.category.create({
      data: c,
    })
    console.log(`Created category with id: ${category.id}`)
  }
  console.log(`Seeding finished.`)
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
