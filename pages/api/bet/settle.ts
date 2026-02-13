/**
 * Settle Bet API Route
 * POST /api/bet/settle - Settle a bet with WIN/LOSE/VOID result
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import { settleBet } from '@/lib/services/betService'
import { getErrorMessage } from '@/lib/utils'
import type { BetResult } from '@/lib/types'

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
    const { betId, result } = req.body

    if (!betId || !result) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      })
    }

    if (!['WIN', 'LOSE', 'VOID'].includes(result)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid result. Must be WIN, LOSE, or VOID',
      })
    }

    const bet = await settleBet(betId, result as BetResult)

    res.status(200).json({
      success: true,
      payoutAmount: bet.payoutAmount,
    })
  } catch (error) {
    console.error('Error settling bet:', error)
    const message = getErrorMessage(error)
    const statusCode = 
      message === 'Bet not found' ? 404 :
      message === 'Bet already settled' ? 400 : 500
    res.status(statusCode).json({
      success: false,
      error: message,
    })
  }
}
