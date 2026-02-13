// Prisma seed script | Prisma 数据种子脚本
// 用于创建初始测试数据 | Used to create initial test data

import prisma from '../lib/prisma'

async function main() {
  console.log('开始种子数据创建 | Starting seed...')

  // 创建10个测试用户 | Create 10 test users
  const users = []
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        displayName: `测试用户${i} | Test User ${i}`,
      },
    })
    users.push(user)
    console.log(`创建用户 | Created user: ${user.email}`)
  }

  // 为每个用户添加初始余额 | Add initial balance for each user
  for (const user of users) {
    // 给每个用户添加 1000 单位的初始存款 | Give each user 1000 units initial deposit
    await prisma.ledgerEntry.create({
      data: {
        userId: user.id,
        type: 'DEPOSIT',
        amount: 1000,
      },
    })
    console.log(`用户 ${user.email} 获得初始余额 1000 | User ${user.email} received initial balance 1000`)
  }

  console.log('种子数据创建完成 | Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('种子数据创建失败 | Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
