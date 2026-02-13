// API: 获取用户投注历史 | API: Get user bet history
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import type { BetWithDetails } from '@/lib/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BetWithDetails[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userId } = req.query

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'userId is required' })
    }

    // 获取用户的所有投注记录 | Get all bets for the user
    const bets = await prisma.bet.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    // 转换为 BetWithDetails 类型 | Convert to BetWithDetails type
    const betsWithDetails: BetWithDetails[] = bets.map((bet) => ({
      id: bet.id,
      userId: bet.userId,
      amount: bet.amount,
      status: bet.status as 'PLACED' | 'SETTLED',
      result: bet.result as 'WIN' | 'LOSE' | 'VOID' | null,
      payoutAmount: bet.payoutAmount,
      createdAt: bet.createdAt,
      settledAt: bet.settledAt,
    }))

    res.status(200).json(betsWithDetails)
  } catch (error) {
    console.error('Error fetching bet history:', error)
    res.status(500).json({ error: 'Failed to fetch bet history' })
  }
}
