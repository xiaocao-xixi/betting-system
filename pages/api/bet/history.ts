/**
 * Bet History API Route
 * GET /api/bet/history?userId=xxx - Get bet history for a user
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import { getUserBetHistory } from '@/lib/services/betService'
import { getErrorMessage } from '@/lib/utils'
import type { Bet } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Bet[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userId } = req.query

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'userId is required' })
    }

    const bets = await getUserBetHistory(userId)
    res.status(200).json(bets)
  } catch (error) {
    console.error('Error fetching bet history:', error)
    res.status(500).json({ error: getErrorMessage(error) })
  }
}
