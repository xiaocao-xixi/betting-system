import { useState, useEffect, useCallback } from 'react'
import type { BetWithDetails, UserWithBalance } from '@/lib/types'

export default function AdminBetsPage() {
  const [allBets, setAllBets] = useState<(BetWithDetails & { user?: UserWithBalance })[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'placed' | 'settled'>('all')

  const loadAllBets = useCallback(async () => {
    try {
      setLoading(true)
      
      // Load all users first
      const usersResponse = await fetch('/api/users')
      const users: UserWithBalance[] = await usersResponse.json()
      
      // Load bets for each user
      const betsPromises = users.map(async (user) => {
        const betsResponse = await fetch(`/api/bet/history?userId=${user.id}`)
        const bets: BetWithDetails[] = await betsResponse.json()
        return bets.map(bet => ({ ...bet, user }))
      })
      
      const betsArrays = await Promise.all(betsPromises)
      const allBetsFlat = betsArrays.flat()
      
      // Sort by creation date, newest first
      allBetsFlat.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      
      setAllBets(allBetsFlat)
    } catch (error) {
      console.error('Error loading bets:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAllBets()
  }, [loadAllBets])

  const filteredBets = allBets.filter(bet => {
    if (filter === 'all') return true
    if (filter === 'placed') return bet.status === 'PLACED'
    if (filter === 'settled') return bet.status === 'SETTLED'
    return true
  })

  const stats = {
    total: allBets.length,
    placed: allBets.filter(b => b.status === 'PLACED').length,
    settled: allBets.filter(b => b.status === 'SETTLED').length,
    totalAmount: allBets.reduce((sum, b) => sum + b.amount, 0),
    totalPayout: allBets.reduce((sum, b) => sum + (b.payoutAmount || 0), 0),
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">All Bets Overview</h1>
        <p className="text-gray-600 mt-2">View and monitor all betting activity</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Bets</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Placed</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.placed}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Settled</p>
          <p className="text-2xl font-bold text-green-600">{stats.settled}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Wagered</p>
          <p className="text-2xl font-bold text-blue-600">{stats.totalAmount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Payout</p>
          <p className="text-2xl font-bold text-purple-600">{stats.totalPayout}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded font-semibold ${
            filter === 'all'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setFilter('placed')}
          className={`px-4 py-2 rounded font-semibold ${
            filter === 'placed'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Placed ({stats.placed})
        </button>
        <button
          onClick={() => setFilter('settled')}
          className={`px-4 py-2 rounded font-semibold ${
            filter === 'settled'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Settled ({stats.settled})
        </button>
      </div>

      {/* Bets Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Result
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payout
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Settled
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBets.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No bets found
                </td>
              </tr>
            ) : (
              filteredBets.map((bet) => (
                <tr key={bet.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {bet.user?.displayName || 'Unknown'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {bet.user?.email || ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{bet.amount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        bet.status === 'PLACED'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {bet.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {bet.result ? (
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          bet.result === 'WIN'
                            ? 'bg-green-100 text-green-800'
                            : bet.result === 'LOSE'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {bet.result}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">
                      {bet.payoutAmount || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(bet.createdAt).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {bet.settledAt
                        ? new Date(bet.settledAt).toLocaleString()
                        : '-'}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
