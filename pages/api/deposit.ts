// API: 管理员为用户充值 | API: Admin deposits balance for user
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

interface DepositRequest {
  userId: string
  amount: number
}

interface DepositResponse {
  success: boolean
  ledgerEntryId?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DepositResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { userId, amount }: DepositRequest = req.body

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

    // 创建存款账本条目 | Create deposit ledger entry
    const ledgerEntry = await prisma.ledgerEntry.create({
      data: {
        userId,
        type: 'DEPOSIT',
        amount,
      },
    })

    res.status(200).json({
      success: true,
      ledgerEntryId: ledgerEntry.id,
    })
  } catch (error) {
    console.error('Error creating deposit:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create deposit',
    })
  }
}
