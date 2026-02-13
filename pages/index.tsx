import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/admin')
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-xl text-gray-600">Redirecting...</div>
    </div>
  )
}
