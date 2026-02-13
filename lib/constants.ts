/**
 * Application Constants
 * Centralized configuration and magic numbers
 */

/**
 * Betting Configuration
 */
export const BETTING_CONFIG = {
  /** Minimum bet amount */
  MIN_BET_AMOUNT: 1,
  
  /** Win multiplier for successful bets */
  WIN_MULTIPLIER: 2,
  
  /** Minimum deposit amount */
  MIN_DEPOSIT_AMOUNT: 1,
} as const

/**
 * UI Configuration
 */
export const UI_CONFIG = {
  /** Toast notification duration in milliseconds */
  TOAST_DURATION: 3000,
  
  /** Loading spinner delay */
  LOADING_DELAY: 300,
} as const

/**
 * Bet Status Labels
 */
export const BET_STATUS_LABELS = {
  PLACED: 'Placed',
  SETTLED: 'Settled',
} as const

/**
 * Bet Result Labels
 */
export const BET_RESULT_LABELS = {
  WIN: 'Win',
  LOSE: 'Lose',
  VOID: 'Void',
} as const

/**
 * Bet Result Colors (Tailwind classes)
 */
export const BET_RESULT_COLORS = {
  WIN: 'text-green-600 bg-green-50',
  LOSE: 'text-red-600 bg-red-50',
  VOID: 'text-gray-600 bg-gray-50',
} as const
