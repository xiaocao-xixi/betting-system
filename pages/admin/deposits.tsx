import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import type { UserWithBalance } from '@/lib/types'

export default function AdminDepositsPage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserWithBalance[]>([])
  const [loading, setLoading] = useState(true)
  const [depositUserId, setDepositUserId] = useState('')
  const [depositAmount, setDepositAmount] = useState('')
  const [depositing, setDepositing] = useState(false)

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users')
      const data = await response.json()
      
      if (Array.isArray(data)) {
        setUsers(data)
      }
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!depositUserId || !depositAmount) {
      alert('Please select a user and enter an amount')
      return
    }

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
        setDepositUserId('')
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

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Deposit Management</h1>
        <p className="text-gray-600 mt-2">Add funds to user accounts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Deposit Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Create Deposit</h2>
          <form onSubmit={handleDeposit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select User
              </label>
              <select
                value={depositUserId}
                onChange={(e) => setDepositUserId(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">-- Select User --</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.displayName} ({user.email}) - Balance: {user.balance}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Deposit Amount
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter amount"
                min="1"
                required
              />
            </div>

            <button
              type="submit"
              disabled={depositing}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            >
              {depositing ? 'Processing...' : 'Add Deposit'}
            </button>
          </form>
        </div>

        {/* User Balance Overview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">User Balances</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100"
              >
                <div>
                  <p className="font-semibold text-gray-800">{user.displayName}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">{user.balance}</p>
                  <p className="text-xs text-gray-500">Balance</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
