/**
 * Users Page
 * Display all users with their balances and provide deposit functionality
 */

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import type { UserWithBalance } from '@/lib/types'
import { formatCurrency, isPositiveInteger, getErrorMessage } from '@/lib/utils'
import { BETTING_CONFIG } from '@/lib/constants'

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserWithBalance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [depositModal, setDepositModal] = useState<{ userId: string; userName: string } | null>(null)
  const [depositAmount, setDepositAmount] = useState('')
  const [depositing, setDepositing] = useState(false)

  /**
   * Load all users with their balances
   */
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/users')
      const data = await response.json()
      
      if (!response.ok || data.error) {
        setError(data.error || 'Failed to fetch users')
        setUsers([])
        return
      }
      
      if (!Array.isArray(data)) {
        setError('Invalid data format')
        setUsers([])
        return
      }
      
      setUsers(data)
    } catch (err) {
      console.error('Error loading users:', err)
      setError(getErrorMessage(err))
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  /**
   * Handle deposit for a user
   */
  const handleDeposit = async () => {
    if (!depositModal || !depositAmount) return

    if (!isPositiveInteger(depositAmount)) {
      alert(`Please enter a valid amount (minimum ${BETTING_CONFIG.MIN_DEPOSIT_AMOUNT})`)
      return
    }

    try {
      setDepositing(true)
      
      const response = await fetch('/api/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: depositModal.userId, 
          amount: parseInt(depositAmount) 
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        alert(`Deposit successful! ${formatCurrency(parseInt(depositAmount))} added to ${depositModal.userName}`)
        setDepositModal(null)
        setDepositAmount('')
        loadUsers()
      } else {
        alert(`Deposit failed: ${result.error}`)
      }
    } catch (err) {
      console.error('Error depositing:', err)
      alert(`Deposit failed: ${getErrorMessage(err)}`)
    } finally {
      setDepositing(false)
    }
  }

  /**
   * Navigate to game page for a user
   */
  const goToGame = (userId: string) => {
    router.push(`/game/${userId}`)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading users...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">Error</h1>
          <p className="text-lg text-gray-600 text-center mb-6">{error}</p>
          <button
            onClick={loadUsers}
            className="mx-auto block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Main content
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Betting System
          </h1>
          <p className="text-gray-600">User Management</p>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            <h2 className="text-2xl font-bold text-white">All Users</h2>
          </div>

          {users.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p>No users found. Please run the seed command:</p>
              <code className="block mt-2 text-sm bg-gray-100 p-2 rounded">npm run prisma:seed</code>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Balance</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-800">{user.displayName}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="text-2xl font-bold text-green-600">{formatCurrency(user.balance)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setDepositModal({ userId: user.id, userName: user.displayName })}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all mr-2"
                        >
                          Deposit
                        </button>
                        <button
                          onClick={() => goToGame(user.id)}
                          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                        >
                          Play Game
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Deposit Modal */}
      {depositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Deposit Funds</h2>
            <p className="text-gray-600 mb-4">
              Add balance to <strong>{depositModal.userName}</strong>
            </p>
            
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder={`Min: ${BETTING_CONFIG.MIN_DEPOSIT_AMOUNT}`}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none mb-4 text-lg"
              disabled={depositing}
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDepositModal(null)
                  setDepositAmount('')
                }}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                disabled={depositing}
              >
                Cancel
              </button>
              <button
                onClick={handleDeposit}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                disabled={depositing || !depositAmount}
              >
                {depositing ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
