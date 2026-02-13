// API: 结算投注 | API: Settle a bet
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import type { BetResult } from '@/lib/types'

interface SettleBetRequest {
  betId: string
  result: BetResult // 'WIN' | 'LOSE' | 'VOID'
}

interface SettleBetResponse {
  success: boolean
  payoutAmount?: number
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SettleBetResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { betId, result }: SettleBetRequest = req.body

    // 验证输入 | Validate input
    if (!betId || !result || !['WIN', 'LOSE', 'VOID'].includes(result)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input. Result must be WIN, LOSE, or VOID',
      })
    }

    // 获取投注记录 | Get bet record
    const bet = await prisma.bet.findUnique({
      where: { id: betId },
    })

    if (!bet) {
      return res.status(404).json({
        success: false,
        error: 'Bet not found',
      })
    }

    // 检查投注状态 | Check bet status
    if (bet.status !== 'PLACED') {
      return res.status(400).json({
        success: false,
        error: 'Bet is not in PLACED status. Cannot settle.',
      })
    }

    // 计算赔付金额 | Calculate payout amount
    // WIN: 赔付 = 投注金额 * 2 | WIN: payout = amount * 2
    // LOSE: 赔付 = 0 | LOSE: payout = 0
    // VOID: 赔付 = 投注金额（退还）| VOID: payout = amount (refund)
    let payoutAmount = 0
    if (result === 'WIN') {
      payoutAmount = bet.amount * 2
    } else if (result === 'VOID') {
      payoutAmount = bet.amount
    }

    // 使用事务确保数据一致性 | Use transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // 如果有赔付，创建 BET_CREDIT 账本条目 | If there's payout, create BET_CREDIT ledger entry
      if (payoutAmount > 0) {
        await tx.ledgerEntry.create({
          data: {
            userId: bet.userId,
            type: 'BET_CREDIT',
            amount: payoutAmount,
          },
        })
      }

      // 更新投注记录 | Update bet record
      await tx.bet.update({
        where: { id: betId },
        data: {
          status: 'SETTLED',
          result,
          payoutAmount,
          settledAt: new Date(),
        },
      })
    })

    res.status(200).json({
      success: true,
      payoutAmount,
    })
  } catch (error) {
    console.error('Error settling bet:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to settle bet',
    })
  }
}
