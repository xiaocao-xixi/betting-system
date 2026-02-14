import prisma from '../lib/prisma'

async function main() {
  console.log('Starting seed...')

  // Create 10 test users
  const users = []
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        displayName: `user${i}`,
      },
    })
    users.push(user)
    console.log(`Created user: ${user.email}`)
  }

  // Add initial balance for each user
  for (const user of users) {
    // Give each user 1000 units initial deposit
    await prisma.ledgerEntry.create({
      data: {
        userId: user.id,
        type: 'DEPOSIT',
        amount: 1000,
      },
    })
    console.log(`User ${user.email} received initial balance 1000`)
  }

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
