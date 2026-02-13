// 游戏页面 | Game Page
// 用户可以下注、查看投注历史、结算投注 | Users can place bets, view bet history, and settle bets

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
  const [placing, setPlacing] = useState(false)
  const [settling, setSettling] = useState<string | null>(null)

  // 加载用户信息和投注历史 | Load user info and bet history
  const loadData = useCallback(async () => {
    if (!userId || typeof userId !== 'string') return

    try {
      setLoading(true)
      // 加载用户列表找到当前用户 | Load user list to find current user
      const usersResponse = await fetch('/api/users')
      const users: UserWithBalance[] = await usersResponse.json()
      const currentUser = users.find((u) => u.id === userId)
      setUser(currentUser || null)

      // 加载投注历史 | Load bet history
      const betsResponse = await fetch(`/api/bet/history?userId=${userId}`)
      const betsData: BetWithDetails[] = await betsResponse.json()
      setBets(betsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadData()
  }, [loadData])

  // 下注 | Place bet
  const handlePlaceBet = async () => {
    if (!userId || typeof userId !== 'string' || !betAmount) return

    const amount = parseInt(betAmount)
    if (isNaN(amount) || amount <= 0) {
      alert('请输入有效的金额 | Please enter a valid amount')
      return
    }

    if (user && amount > user.balance) {
      alert('余额不足 | Insufficient balance')
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
        alert(`下注成功！| Bet placed! Bet ID: ${result.betId}`)
        setBetAmount('')
        loadData() // 重新加载数据 | Reload data
      } else {
        alert(`下注失败：${result.error} | Bet failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Error placing bet:', error)
      alert('下注失败 | Bet failed')
    } finally {
      setPlacing(false)
    }
  }

  // 结算投注 | Settle bet
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
        alert(
          `结算成功！| Settlement successful! Payout: ${data.payoutAmount}`
        )
        loadData() // 重新加载数据 | Reload data
      } else {
        alert(`结算失败：${data.error} | Settlement failed: ${data.error}`)
      }
    } catch (error) {
      console.error('Error settling bet:', error)
      alert('结算失败 | Settlement failed')
    } finally {
      setSettling(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">加载中... | Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">用户未找到 | User not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-4">
          <button
            onClick={() => router.push('/')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            ← 返回 | Back
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            {user.displayName}
          </h1>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">邮箱 | Email</p>
              <p className="text-lg font-semibold">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-600">余额 | Balance</p>
              <p className="text-lg font-semibold text-green-600">
                {user.balance}
              </p>
            </div>
          </div>
        </div>

        {/* 下注区域 | Betting Area */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            下注 | Place Bet
          </h2>
          <div className="flex space-x-4">
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="输入投注金额 | Enter bet amount"
              min="1"
            />
            <button
              onClick={handlePlaceBet}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
              disabled={placing}
            >
              {placing ? '处理中... | Processing...' : '下注 | Place Bet'}
            </button>
          </div>
        </div>

        {/* 投注历史 | Bet History */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-2xl font-bold text-gray-800">
              投注历史 | Bet History
            </h2>
          </div>

          {bets.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              暂无投注记录 | No bets yet
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    时间 | Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    金额 | Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态 | Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    结果 | Result
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    赔付 | Payout
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作 | Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bets.map((bet) => (
                  <tr key={bet.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(bet.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {bet.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bet.payoutAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {bet.status === 'PLACED' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSettleBet(bet.id, 'WIN')}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-xs"
                            disabled={settling === bet.id}
                          >
                            WIN
                          </button>
                          <button
                            onClick={() => handleSettleBet(bet.id, 'LOSE')}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs"
                            disabled={settling === bet.id}
                          >
                            LOSE
                          </button>
                          <button
                            onClick={() => handleSettleBet(bet.id, 'VOID')}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs"
                            disabled={settling === bet.id}
                          >
                            VOID
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
