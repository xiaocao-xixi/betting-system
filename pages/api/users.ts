/**
 * Users API Route
 * GET /api/users - Fetch all users with their balances
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import type { UserWithBalance } from '@/lib/types'
import { getAllUsersWithBalances } from '@/lib/services/userService'
import { getErrorMessage } from '@/lib/utils'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserWithBalance[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const users = await getAllUsersWithBalances()
    res.status(200).json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: getErrorMessage(error) })
  }
}
