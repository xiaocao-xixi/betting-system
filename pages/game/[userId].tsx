/**
 * Game Page
 * Allows users to place bets and view their betting history
 */

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import type { UserWithBalance } from '@/lib/types'
import type { Bet } from '@prisma/client'
import { formatCurrency, formatDate, isPositiveInteger, getErrorMessage } from '@/lib/utils'
import { BETTING_CONFIG, BET_RESULT_COLORS, UI_CONFIG } from '@/lib/constants'

type BetResult = 'WIN' | 'LOSE' | 'VOID'

export default function GamePage() {
  const router = useRouter()
  const { userId } = router.query

  const [user, setUser] = useState<UserWithBalance | null>(null)
  const [bets, setBets] = useState<Bet[]>([])
  const [betAmount, setBetAmount] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [placing, setPlacing] = useState(false)
  const [settling, setSettling] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  /**
   * Show notification toast
   */
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), UI_CONFIG.TOAST_DURATION)
  }

  /**
   * Load user data and bet history
   */
  const loadData = useCallback(async () => {
    if (!userId || typeof userId !== 'string') return

    try {
      setLoading(true)
      setError(null)
      
      // Fetch user data
      const usersResponse = await fetch('/api/users')
      const usersData = await usersResponse.json()
      
      if (!usersResponse.ok || usersData.error) {
        setError(usersData.error || 'Failed to fetch user information')
        return
      }
      
      const users: UserWithBalance[] = Array.isArray(usersData) ? usersData : []
      const currentUser = users.find((u) => u.id === userId)
      
      if (!currentUser) {
        setError('User not found')
        return
      }
      
      setUser(currentUser)

      // Fetch bet history
      const betsResponse = await fetch(`/api/bet/history?userId=${userId}`)
      const betsData = await betsResponse.json()
      
      setBets(Array.isArray(betsData) ? betsData : [])
    } catch (err) {
      console.error('Error loading data:', err)
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadData()
  }, [loadData])

  /**
   * Place a new bet
   */
  const handlePlaceBet = async () => {
    if (!userId || typeof userId !== 'string' || !betAmount) return

    if (!isPositiveInteger(betAmount)) {
      showNotification('error', `Please enter a valid amount (minimum ${BETTING_CONFIG.MIN_BET_AMOUNT})`)
      return
    }

    const amount = parseInt(betAmount)

    if (user && amount > user.balance) {
      showNotification('error', `Insufficient balance. Current: ${formatCurrency(user.balance)}`)
      return
    }

    try {
      setPlacing(true)
      
      const response = await fetch('/api/bet/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount }),
      })

      const result = await response.json()
      
      if (result.success) {
        showNotification('success', `Bet placed! Amount: ${formatCurrency(amount)}`)
        setBetAmount('')
        loadData()
      } else {
        showNotification('error', result.error || 'Failed to place bet')
      }
    } catch (err) {
      console.error('Error placing bet:', err)
      showNotification('error', getErrorMessage(err))
    } finally {
      setPlacing(false)
    }
  }

  /**
   * Settle a bet with WIN/LOSE/VOID result
   */
  const handleSettleBet = async (betId: string, result: BetResult) => {
    try {
      setSettling(betId)
      
      const response = await fetch('/api/bet/settle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ betId, result }),
      })

      const data = await response.json()
      
      if (data.success) {
        showNotification('success', `Bet settled! Result: ${result}, Payout: ${formatCurrency(data.payoutAmount)}`)
        loadData()
      } else {
        showNotification('error', data.error || 'Failed to settle bet')
      }
    } catch (err) {
      console.error('Error settling bet:', err)
      showNotification('error', getErrorMessage(err))
    } finally {
      setSettling(null)
    }
  }

  /**
   * Get color classes for bet result
   */
  const getResultColor = (result: BetResult | null): string => {
    if (!result) return 'text-gray-600 bg-gray-50'
    return BET_RESULT_COLORS[result] || 'text-gray-600 bg-gray-50'
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-2xl font-bold text-gray-700">Loading game...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-4">
            {error ? 'Error' : 'User Not Found'}
          </h3>
          <p className="text-gray-600 text-center mb-6">
            {error || 'The user you are looking for does not exist.'}
          </p>
          <button
            onClick={() => router.push('/users')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg"
          >
            Back to User List
          </button>
        </div>
      </div>
    )
  }

  // Main game interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with User Info */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{user.displayName}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Balance</p>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(user.balance)}</p>
            </div>
          </div>
        </div>

        {/* Place Bet Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Place a Bet</h2>
          <div className="flex gap-4">
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              placeholder={`Enter amount (min: ${BETTING_CONFIG.MIN_BET_AMOUNT})`}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
              disabled={placing}
            />
            <button
              onClick={handlePlaceBet}
              disabled={placing || !betAmount}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {placing ? 'Placing...' : 'Place Bet'}
            </button>
          </div>
        </div>

        {/* Bet History */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600">
            <h2 className="text-2xl font-bold text-white">Bet History</h2>
          </div>

          {bets.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg">No bets yet. Place your first bet above!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Result</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Payout</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bets.map((bet) => (
                    <tr key={bet.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(bet.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                        {formatCurrency(bet.amount)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          bet.status === 'PLACED' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {bet.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {bet.result ? (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getResultColor(bet.result as BetResult)}`}>
                            {bet.result}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">
                        {bet.payoutAmount > 0 ? formatCurrency(bet.payoutAmount) : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {bet.status === 'PLACED' && (
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleSettleBet(bet.id, 'WIN')}
                              disabled={settling === bet.id}
                              className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded hover:bg-green-600 disabled:opacity-50"
                            >
                              Win
                            </button>
                            <button
                              onClick={() => handleSettleBet(bet.id, 'LOSE')}
                              disabled={settling === bet.id}
                              className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded hover:bg-red-600 disabled:opacity-50"
                            >
                              Lose
                            </button>
                            <button
                              onClick={() => handleSettleBet(bet.id, 'VOID')}
                              disabled={settling === bet.id}
                              className="px-3 py-1 bg-gray-500 text-white text-sm font-semibold rounded hover:bg-gray-600 disabled:opacity-50"
                            >
                              Void
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <button
            onClick={() => router.push('/users')}
            className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Back to User List
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 animate-fade-in">
          <div className={`px-6 py-4 rounded-lg shadow-2xl ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white font-semibold`}>
            {notification.message}
          </div>
        </div>
      )}
    </div>
  )
}
