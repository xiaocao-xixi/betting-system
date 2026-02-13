import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/users')
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="text-2xl font-bold text-gray-700">Redirecting...</div>
    </div>
  )
}
