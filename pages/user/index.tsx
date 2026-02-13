import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import type { UserWithBalance } from '@/lib/types'

export default function UserSelectPage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserWithBalance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        setError('Invalid data format')
        setUsers([])
      }
    } catch (error) {
      console.error('Error loading users:', error)
      setError('Failed to load users')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

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
            <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
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
        <h1 className="text-3xl font-bold text-gray-800">Select User to Play</h1>
        <p className="text-gray-600 mt-2">Choose a user account to start playing</p>
      </div>

      {users.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">No users available</h3>
          <p className="text-yellow-700">Please seed the database first.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border-2 border-transparent hover:border-green-500"
              onClick={() => router.push(`/user/game/${user.id}`)}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-800">{user.displayName}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Balance:</span>
                  <span className="text-xl font-bold text-green-600">{user.balance}</span>
                </div>
              </div>
              <button className="mt-4 w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">
                Play Game
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
