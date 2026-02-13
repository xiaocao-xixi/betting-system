import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import type { UserWithBalance, BetWithDetails } from '@/lib/types'

export default function GamePage() {
  const router = useRouter()
  const { userId } = router.query

  const [user, setUser] = useState<UserWithBalance | null>(null)
  const [bets, setBets] = useState<BetWithDetails[]>([])
  const [betAmount, setBetAmount] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [placing, setPlacing] = useState(false)
  const [settling, setSettling] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const loadData = useCallback(async () => {
    if (!userId || typeof userId !== 'string') return

    try {
      setLoading(true)
      setError(null)
      
      const usersResponse = await fetch('/api/users')
      const usersData = await usersResponse.json()
      
      if (!usersResponse.ok || usersData.error) {
        setError(usersData.error || 'Failed to fetch user information. Please check your connection.')
        return
      }
      
      const users: UserWithBalance[] = Array.isArray(usersData) ? usersData : []
      const currentUser = users.find((u) => u.id === userId)
      setUser(currentUser || null)

      const betsResponse = await fetch(`/api/bet/history?userId=${userId}`)
      const betsData = await betsResponse.json()
      
      setBets(Array.isArray(betsData) ? betsData : [])
    } catch (error) {
      console.error('Error loading data:', error)
      setError('Failed to load data. Please ensure the database is initialized and running.')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handlePlaceBet = async () => {
    if (!userId || typeof userId !== 'string' || !betAmount) return

    const amount = parseInt(betAmount)
    if (isNaN(amount) || amount <= 0) {
      showNotification('error', 'Please enter a valid amount greater than zero')
      return
    }

    if (user && amount > user.balance) {
      showNotification('error', `Insufficient balance. Your current balance is ${user.balance}`)
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
        showNotification('success', `Bet placed successfully! Bet ID: ${result.betId}`)
        setBetAmount('')
        loadData()
      } else {
        showNotification('error', `Failed to place bet: ${result.error}`)
      }
    } catch (error) {
      console.error('Error placing bet:', error)
      showNotification('error', 'Failed to place bet. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  const handleSettleBet = async (betId: string, result: 'WIN' | 'LOSE' | 'VOID') => {
    try {
      setSettling(betId)
      const response = await fetch('/api/bet/settle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ betId, result }),
      })

      const data = await response.json()
      if (data.success) {
        showNotification('success', `Bet settled successfully! Payout: ${data.payoutAmount}`)
        loadData()
      } else {
        showNotification('error', `Failed to settle bet: ${data.error}`)
      }
    } catch (error) {
      console.error('Error settling bet:', error)
      showNotification('error', 'Failed to settle bet. Please try again.')
    } finally {
      setSettling(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Something Went Wrong
            </h3>
            <p className="text-gray-600 text-center mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push('/user')}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Back to Home
              </button>
              <button
                onClick={() => loadData()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-amber-100 p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
              User Not Found
            </h3>
            <p className="text-gray-600 text-center mb-6">
              We couldn't find the user you're looking for. The database may need to be initialized.
            </p>
            <button
              onClick={() => router.push('/user')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`rounded-lg shadow-lg p-4 max-w-md ${
            notification.type === 'success' 
              ? 'bg-green-50 border-l-4 border-green-500' 
              : 'bg-red-50 border-l-4 border-red-500'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {notification.type === 'success' ? (
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className={`ml-3 text-sm font-medium ${
                notification.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {notification.message}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/user')}
            className="inline-flex items-center px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-sm transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {user.displayName}
              </h1>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Current Balance</p>
              <p className="text-4xl font-bold text-green-600">{formatCurrency(user.balance)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Place a Bet</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="betAmount" className="block text-sm font-medium text-gray-700 mb-2">
                Bet Amount
              </label>
              <input
                id="betAmount"
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                placeholder="Enter amount"
                min="1"
                disabled={placing}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handlePlaceBet}
                className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:cursor-not-allowed"
                disabled={placing || !betAmount}
              >
                {placing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Place Bet'
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600">
            <h2 className="text-2xl font-bold text-white">Bet History</h2>
          </div>

          {bets.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 text-lg">No bets placed yet</p>
              <p className="text-gray-400 text-sm mt-2">Place your first bet to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Result
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Payout
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bets.map((bet) => (
                    <tr key={bet.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(bet.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatCurrency(bet.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            bet.status === 'PLACED'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {bet.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {bet.result && (
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              bet.result === 'WIN'
                                ? 'bg-green-100 text-green-800'
                                : bet.result === 'LOSE'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {bet.result}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatCurrency(bet.payoutAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {bet.status === 'PLACED' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSettleBet(bet.id, 'WIN')}
                              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={settling === bet.id}
                            >
                              Win
                            </button>
                            <button
                              onClick={() => handleSettleBet(bet.id, 'LOSE')}
                              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={settling === bet.id}
                            >
                              Lose
                            </button>
                            <button
                              onClick={() => handleSettleBet(bet.id, 'VOID')}
                              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={settling === bet.id}
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
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
