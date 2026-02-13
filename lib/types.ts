// Type definitions for the betting system | 投注系统类型定义

// 账本类型 | Ledger Type
export type LedgerType = 'DEPOSIT' | 'BET_DEBIT' | 'BET_CREDIT'

// 投注状态 | Bet Status
export type BetStatus = 'PLACED' | 'SETTLED'

// 投注结果 | Bet Result
export type BetResult = 'WIN' | 'LOSE' | 'VOID'

// 用户余额信息 | User with Balance
export interface UserWithBalance {
  id: string
  email: string
  displayName: string
  balance: number
}

// 投注历史 | Bet History
export interface BetWithDetails {
  id: string
  userId: string
  amount: number
  status: BetStatus
  result: BetResult | null
  payoutAmount: number
  createdAt: Date
  settledAt: Date | null
}
