/**
 * Bet Service
 * Handles all betting-related business logic
 */

import prisma from '@/lib/prisma'
import { calculateUserBalance } from './userService'
import type { Bet } from '@prisma/client'

/**
 * Place a new bet for a user
 * Validates balance and creates BET_DEBIT ledger entry
 */
export async function placeBet(userId: string, amount: number): Promise<Bet> {
  if (amount <= 0) {
    throw new Error('Bet amount must be positive')
  }

  const currentBalance = await calculateUserBalance(userId)

  if (amount > currentBalance) {
    throw new Error('Insufficient balance')
  }

  const result = await prisma.$transaction(async (tx) => {
    const bet = await tx.bet.create({
      data: {
        userId,
        amount,
        status: 'PLACED',
        result: null,
        payoutAmount: 0,
      },
    })

    await tx.ledgerEntry.create({
      data: {
        userId,
        type: 'BET_DEBIT',
        amount,
      },
    })

    return bet
  })

  return result
}

/**
 * Settle a bet with WIN/LOSE/VOID result
 * WIN: payout = amount * 2, creates BET_CREDIT ledger entry
 * LOSE: payout = 0
 * VOID: payout = amount (refund), creates BET_CREDIT ledger entry
 */
export async function settleBet(
  betId: string,
  result: 'WIN' | 'LOSE' | 'VOID'
): Promise<Bet> {
  const bet = await prisma.bet.findUnique({
    where: { id: betId },
  })

  if (!bet) {
    throw new Error('Bet not found')
  }

  if (bet.status === 'SETTLED') {
    throw new Error('Bet already settled')
  }

  let payoutAmount = 0
  switch (result) {
    case 'WIN':
      payoutAmount = bet.amount * 2
      break
    case 'LOSE':
      payoutAmount = 0
      break
    case 'VOID':
      payoutAmount = bet.amount
      break
  }

  const updatedBet = await prisma.$transaction(async (tx) => {
    const updated = await tx.bet.update({
      where: { id: betId },
      data: {
        status: 'SETTLED',
        result,
        payoutAmount,
      },
    })

    if (payoutAmount > 0) {
      await tx.ledgerEntry.create({
        data: {
          userId: bet.userId,
          type: 'BET_CREDIT',
          amount: payoutAmount,
        },
      })
    }

    return updated
  })

  return updatedBet
}

/**
 * Get bet history for a user
 */
export async function getUserBetHistory(userId: string): Promise<Bet[]> {
  return prisma.bet.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}
