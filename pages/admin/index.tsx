import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import type { UserWithBalance } from '@/lib/types'

export default function AdminPage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserWithBalance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [depositUserId, setDepositUserId] = useState<string | null>(null)
  const [depositAmount, setDepositAmount] = useState('')
  const [depositing, setDepositing] = useState(false)

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
      
      if (Array.isArray(data)) {
        setUsers(data)
      } else {
        console.error('Expected array but got:', data)
        setError('Invalid data format')
        setUsers([])
      }
    } catch (error) {
      console.error('Error loading users:', error)
      setError('Failed to load. Please check if database is initialized.')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const handleDeposit = async () => {
    if (!depositUserId || !depositAmount) return

    const amount = parseInt(depositAmount)
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount')
      return
    }

    try {
      setDepositing(true)
      const response = await fetch('/api/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: depositUserId, amount }),
      })

      const result = await response.json()
      if (result.success) {
        alert(`Deposit successful! Amount: ${amount}`)
        setDepositUserId(null)
        setDepositAmount('')
        loadUsers()
      } else {
        alert(`Deposit failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Error depositing:', error)
      alert('Deposit failed')
    } finally {
      setDepositing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded">
            <div className="flex items-center mb-4">
              <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="ml-3 text-lg font-medium text-red-800">Error</h3>
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="bg-white border border-red-200 rounded p-4 mb-4">
              <p className="text-sm font-semibold mb-2">Possible causes:</p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Database not initialized</li>
                <li>Database file doesn't exist</li>
                <li>Prisma client not generated</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <p className="text-sm font-semibold mb-2">Solution steps:</p>
              <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
                <li>
                  Run database migration:
                  <code className="block bg-gray-800 text-white px-2 py-1 rounded mt-1">
                    npx prisma migrate dev --name init
                  </code>
                </li>
                <li>
                  Generate Prisma client:
                  <code className="block bg-gray-800 text-white px-2 py-1 rounded mt-1">
                    npx prisma generate
                  </code>
                </li>
                <li>
                  Seed test data:
                  <code className="block bg-gray-800 text-white px-2 py-1 rounded mt-1">
                    npm run prisma:seed
                  </code>
                </li>
              </ol>
            </div>
            <button
              onClick={() => loadUsers()}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-600 mt-2">View and manage all users, balances, and deposits</p>
      </div>

      {users.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded">
          <div className="flex items-center mb-4">
            <svg className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="ml-3 text-lg font-medium text-yellow-800">No user data</h3>
          </div>
          <p className="text-yellow-700 mb-4">No users in database. Please run the seed script.</p>
          <code className="block bg-gray-800 text-white px-2 py-1 rounded">npm run prisma:seed</code>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Display Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.displayName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">{user.balance}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => setDepositUserId(user.id)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Deposit
                    </button>
                    <button
                      onClick={() => router.push(`/user/game/${user.id}`)}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      View Game
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Deposit Modal */}
      {depositUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Deposit Funds</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Amount</label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter deposit amount"
                min="1"
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setDepositUserId(null)
                  setDepositAmount('')
                }}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                disabled={depositing}
              >
                Cancel
              </button>
              <button
                onClick={handleDeposit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={depositing}
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
