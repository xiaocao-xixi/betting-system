// 用户列表页面 | User List Page
// 显示所有用户及其余额，提供充值功能 | Show all users with balances and deposit functionality

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import type { UserWithBalance } from '@/lib/types'

export default function HomePage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserWithBalance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [depositUserId, setDepositUserId] = useState<string | null>(null)
  const [depositAmount, setDepositAmount] = useState('')
  const [depositing, setDepositing] = useState(false)

  // 加载用户列表 | Load user list
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/users')
      const data = await response.json()
      
      // 检查是否返回错误 | Check if error was returned
      if (!response.ok || data.error) {
        setError(data.error || '获取用户列表失败 | Failed to fetch users')
        setUsers([])
        return
      }
      
      // 确保数据是数组 | Ensure data is an array
      if (Array.isArray(data)) {
        setUsers(data)
      } else {
        console.error('Expected array but got:', data)
        setError('数据格式错误 | Invalid data format')
        setUsers([])
      }
    } catch (error) {
      console.error('Error loading users:', error)
      setError('加载失败，请检查数据库是否已初始化 | Failed to load. Please check if database is initialized.')
      setUsers([])
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">
                  错误 | Error
                </h3>
              </div>
            </div>
            <div className="text-red-700 mb-4">
              <p className="font-semibold">{error}</p>
            </div>
            <div className="bg-white border border-red-200 rounded p-4 mb-4">
              <p className="text-sm text-gray-700 font-semibold mb-2">
                💡 可能的原因 | Possible causes:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>数据库未初始化 | Database not initialized</li>
                <li>数据库文件不存在 | Database file doesn't exist</li>
                <li>Prisma 客户端未生成 | Prisma client not generated</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <p className="text-sm text-gray-700 font-semibold mb-2">
                🔧 解决步骤 | Solution steps:
              </p>
              <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
                <li>
                  运行数据库迁移 | Run database migration:
                  <code className="block bg-gray-800 text-white px-2 py-1 rounded mt-1">
                    npx prisma migrate dev --name init
                  </code>
                </li>
                <li>
                  生成 Prisma 客户端 | Generate Prisma client:
                  <code className="block bg-gray-800 text-white px-2 py-1 rounded mt-1">
                    npx prisma generate
                  </code>
                </li>
                <li>
                  填充测试数据 | Seed test data:
                  <code className="block bg-gray-800 text-white px-2 py-1 rounded mt-1">
                    npm run prisma:seed
                  </code>
                </li>
                <li>
                  刷新页面 | Refresh the page
                </li>
              </ol>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => loadUsers()}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                重试 | Retry
              </button>
              <a
                href="/START_HERE.md"
                target="_blank"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block"
              >
                查看文档 | View Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          投注系统 - 用户列表 | Betting System - User List
        </h1>

        {users.length === 0 ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-yellow-800">
                  没有用户数据 | No user data
                </h3>
              </div>
            </div>
            <p className="text-yellow-700 mb-4">
              数据库中没有用户。请运行种子数据脚本。
              <br />
              No users in database. Please run the seed script.
            </p>
            <div className="bg-white border border-yellow-200 rounded p-4">
              <p className="text-sm text-gray-700 font-semibold mb-2">
                运行以下命令填充测试数据 | Run this command to seed test data:
              </p>
              <code className="block bg-gray-800 text-white px-2 py-1 rounded">
                npm run prisma:seed
              </code>
            </div>
          </div>
        ) : (
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
        )}

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
