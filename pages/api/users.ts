// API: 获取所有用户及其余额 | API: Get all users with their balances
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import type { UserWithBalance } from '@/lib/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserWithBalance[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 获取所有用户 | Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        displayName: true,
      },
    })

    // 为每个用户计算余额 | Calculate balance for each user
    // 余额公式：balance = sum(DEPOSIT) + sum(BET_CREDIT) - sum(BET_DEBIT)
    const usersWithBalance: UserWithBalance[] = await Promise.all(
      users.map(async (user) => {
        const ledgerEntries = await prisma.ledgerEntry.findMany({
          where: { userId: user.id },
          select: { type: true, amount: true },
        })

        const balance = ledgerEntries.reduce((acc, entry) => {
          if (entry.type === 'DEPOSIT' || entry.type === 'BET_CREDIT') {
            return acc + entry.amount
          } else if (entry.type === 'BET_DEBIT') {
            return acc - entry.amount
          }
          return acc
        }, 0)

        return {
          ...user,
          balance,
        }
      })
    )

    res.status(200).json(usersWithBalance)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
}
