/**
 * User Service
 * Handles all user-related business logic including balance calculations
 */

import prisma from '@/lib/prisma'
import type { UserWithBalance } from '@/lib/types'

/**
 * Calculate user balance from ledger entries
 * Formula: balance = DEPOSIT + BET_CREDIT - BET_DEBIT
 */
export async function calculateUserBalance(userId: string): Promise<number> {
  const entries = await prisma.ledgerEntry.findMany({
    where: { userId },
  })

  return entries.reduce((balance, entry) => {
    switch (entry.type) {
      case 'DEPOSIT':
      case 'BET_CREDIT':
        return balance + entry.amount
      case 'BET_DEBIT':
        return balance - entry.amount
      default:
        return balance
    }
  }, 0)
}

/**
 * Get all users with their calculated balances
 */
export async function getAllUsersWithBalances(): Promise<UserWithBalance[]> {
  const users = await prisma.user.findMany({
    orderBy: { email: 'asc' },
  })

  const usersWithBalances = await Promise.all(
    users.map(async (user) => ({
      ...user,
      balance: await calculateUserBalance(user.id),
    }))
  )

  return usersWithBalances
}

/**
 * Get a single user with balance
 */
export async function getUserWithBalance(userId: string): Promise<UserWithBalance | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    return null
  }

  return {
    ...user,
    balance: await calculateUserBalance(user.id),
  }
}

/**
 * Deposit funds for a user
 * Creates a DEPOSIT ledger entry
 */
export async function depositFunds(userId: string, amount: number): Promise<void> {
  if (amount <= 0) {
    throw new Error('Deposit amount must be positive')
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new Error('User not found')
  }

  await prisma.ledgerEntry.create({
    data: {
      userId,
      type: 'DEPOSIT',
      amount,
    },
  })
}
