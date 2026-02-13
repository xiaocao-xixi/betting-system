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
        setError(usersData.error || 'Failed to fetch user information')
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
      setError('Failed to load data. Please ensure the database is initialized.')
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
      showNotification('error', `Insufficient balance. Your current balance is $${user.balance}`)
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
        showNotification('success', `Bet placed successfully! Amount: $${amount}`)
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
        showNotification('success', `Bet settled successfully! Result: ${result}, Payout: $${data.payoutAmount}`)
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-2xl font-bold text-gray-700">Loading...</p>
        </div>
      </div>
    )
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`rounded-xl shadow-2xl p-4 max-w-md ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {notification.type === 'success' ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="ml-3 font-semibold">{notification.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/users')}
            className="inline-flex items-center px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to User List
          </button>
        </div>

        {/* User Info & Balance */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-6">
                <span className="text-white font-bold text-3xl">
                  {user.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {user.displayName}
                </h1>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="text-right bg-gradient-to-br from-green-50 to-emerald-50 px-8 py-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Balance</p>
              <p className="text-5xl font-bold text-green-600">${user.balance.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Place Bet Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Place a Bet</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="betAmount" className="block text-sm font-bold text-gray-700 mb-3">
                Bet Amount
              </label>
              <input
                id="betAmount"
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="w-full px-6 py-4 text-xl border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all"
                placeholder="Enter amount"
                min="1"
                disabled={placing}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handlePlaceBet}
                className="w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none"
                disabled={placing || !betAmount}
              >
                {placing ? 'Placing...' : 'Place Bet'}
              </button>
            </div>
          </div>
        </div>

        {/* Bet History */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600">
            <h2 className="text-3xl font-bold text-white">Bet History</h2>
          </div>

          {bets.length === 0 ? (
            <div className="p-16 text-center">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-2xl font-bold text-gray-400 mb-2">No bets placed yet</p>
              <p className="text-gray-500">Place your first bet to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase">Date</th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase">Amount</th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase">Status</th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase">Result</th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase">Payout</th>
                    <th className="px-8 py-4 text-center text-sm font-bold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bets.map((bet) => (
                    <tr key={bet.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-700">
                        {new Date(bet.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className="text-xl font-bold text-gray-900">${bet.amount}</span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className={`px-4 py-2 inline-flex text-sm font-bold rounded-full ${
                          bet.status === 'PLACED'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {bet.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        {bet.result && (
                          <span className={`px-4 py-2 inline-flex text-sm font-bold rounded-full ${
                            bet.result === 'WIN'
                              ? 'bg-green-100 text-green-800'
                              : bet.result === 'LOSE'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {bet.result}
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className="text-xl font-bold text-green-600">${bet.payoutAmount}</span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        {bet.status === 'PLACED' && (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleSettleBet(bet.id, 'WIN')}
                              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-5 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                              disabled={settling === bet.id}
                            >
                              Win
                            </button>
                            <button
                              onClick={() => handleSettleBet(bet.id, 'LOSE')}
                              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-5 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                              disabled={settling === bet.id}
                            >
                              Lose
                            </button>
                            <button
                              onClick={() => handleSettleBet(bet.id, 'VOID')}
                              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-5 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
