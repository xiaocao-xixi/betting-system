/**
 * Deposit API Route
 * POST /api/deposit - Deposit funds for a user
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import { depositFunds } from '@/lib/services/userService'
import { getErrorMessage, isPositiveInteger } from '@/lib/utils'
import { BETTING_CONFIG } from '@/lib/constants'

interface DepositResponse {
  success: boolean
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
    const { userId, amount } = req.body

    if (!userId || !amount) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields' 
      })
    }

    if (!isPositiveInteger(amount)) {
      return res.status(400).json({ 
        success: false,
        error: `Invalid amount. Must be at least ${BETTING_CONFIG.MIN_DEPOSIT_AMOUNT}` 
      })
    }

    const numAmount = typeof amount === 'string' ? parseInt(amount) : amount
    await depositFunds(userId, numAmount)

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error processing deposit:', error)
    const message = getErrorMessage(error)
    const statusCode = message === 'User not found' ? 404 : 500
    res.status(statusCode).json({ success: false, error: message })
  }
}
