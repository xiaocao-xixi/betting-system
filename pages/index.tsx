// 用户列表页面 | User List Page
// 显示所有用户及其余额，提供充值功能 | Show all users with balances and deposit functionality

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import type { UserWithBalance } from '@/lib/types'

export default function HomePage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserWithBalance[]>([])
  const [loading, setLoading] = useState(true)
  const [depositUserId, setDepositUserId] = useState<string | null>(null)
  const [depositAmount, setDepositAmount] = useState('')
  const [depositing, setDepositing] = useState(false)

  // 加载用户列表 | Load user list
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  // 处理充值 | Handle deposit
  const handleDeposit = async () => {
    if (!depositUserId || !depositAmount) return

    const amount = parseInt(depositAmount)
    if (isNaN(amount) || amount <= 0) {
      alert('请输入有效的金额 | Please enter a valid amount')
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
        alert(`充值成功！| Deposit successful! Amount: ${amount}`)
        setDepositUserId(null)
        setDepositAmount('')
        loadUsers() // 重新加载用户列表 | Reload user list
      } else {
        alert(`充值失败：${result.error} | Deposit failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Error depositing:', error)
      alert('充值失败 | Deposit failed')
    } finally {
      setDepositing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">加载中... | Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          投注系统 - 用户列表 | Betting System - User List
        </h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  显示名称 | Display Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  邮箱 | Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  余额 | Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作 | Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.displayName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">
                      {user.balance}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setDepositUserId(user.id)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                      充值 | Deposit
                    </button>
                    <button
                      onClick={() => router.push(`/game/${user.id}`)}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      进入游戏 | Play Game
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 充值弹窗 | Deposit Modal */}
        {depositUserId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">
                充值 | Deposit
              </h2>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  金额 | Amount
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="输入充值金额 | Enter amount"
                  min="1"
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
                  取消 | Cancel
                </button>
                <button
                  onClick={handleDeposit}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  disabled={depositing}
                >
                  {depositing ? '处理中... | Processing...' : '确认 | Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
