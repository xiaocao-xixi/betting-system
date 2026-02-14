/**
 * Utility Functions
 * Common helper functions used across the application
 */

/**
 * Format number as currency (e.g., 1000 -> "$1,000")
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Extract user avatar from display name
 * Tries to extract number, falls back to first letter
 */
export function getUserAvatar(displayName: string): string {
  const numberMatch = displayName.match(/\d+/)
  return numberMatch ? numberMatch[0] : displayName.charAt(0).toUpperCase()
}

/**
 * Validate positive integer
 */
export function isPositiveInteger(value: string | number): boolean {
  const num = typeof value === 'string' ? parseInt(value) : value
  return !isNaN(num) && num > 0 && Number.isInteger(num)
}

/**
 * Handle API error and return user-friendly message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unexpected error occurred'
}
