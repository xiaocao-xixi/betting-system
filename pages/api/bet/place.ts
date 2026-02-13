/**
 * Place Bet API Route
 * POST /api/bet/place - Place a new bet
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import { placeBet } from '@/lib/services/betService'
import { getErrorMessage, isPositiveInteger } from '@/lib/utils'
import { BETTING_CONFIG } from '@/lib/constants'

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
    const { userId, amount } = req.body

    if (!userId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      })
    }

    if (!isPositiveInteger(amount)) {
      return res.status(400).json({
        success: false,
        error: `Invalid amount. Must be at least ${BETTING_CONFIG.MIN_BET_AMOUNT}`,
      })
    }

    const numAmount = typeof amount === 'string' ? parseInt(amount) : amount
    const bet = await placeBet(userId, numAmount)

    res.status(200).json({
      success: true,
      betId: bet.id,
    })
  } catch (error) {
    console.error('Error placing bet:', error)
    const message = getErrorMessage(error)
    const statusCode = message === 'Insufficient balance' ? 400 : 500
    res.status(statusCode).json({
      success: false,
      error: message,
    })
  }
}
