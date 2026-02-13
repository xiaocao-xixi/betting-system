// API: 用户下注 | API: Place a bet
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

interface PlaceBetRequest {
  userId: string
  amount: number
}

interface PlaceBetResponse {
  success: boolean
  betId?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PlaceBetResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { userId, amount }: PlaceBetRequest = req.body

    // 验证输入 | Validate input
    if (!userId || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input. Amount must be positive number',
      })
    }

    // 检查用户是否存在 | Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      })
    }

    // 计算当前余额 | Calculate current balance
    const ledgerEntries = await prisma.ledgerEntry.findMany({
      where: { userId },
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

    // 检查余额是否足够 | Check if balance is sufficient
    if (balance < amount) {
      return res.status(400).json({
        success: false,
        error: `Insufficient balance. Current balance: ${balance}, required: ${amount}`,
      })
    }

    // 使用事务确保数据一致性 | Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // 创建 BET_DEBIT 账本条目 | Create BET_DEBIT ledger entry
      await tx.ledgerEntry.create({
        data: {
          userId,
          type: 'BET_DEBIT',
          amount,
        },
      })

      // 创建投注记录 | Create bet record
      const bet = await tx.bet.create({
        data: {
          userId,
          amount,
          status: 'PLACED',
        },
      })

      return bet
    })

    res.status(200).json({
      success: true,
      betId: result.id,
    })
  } catch (error) {
    console.error('Error placing bet:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to place bet',
    })
  }
}
