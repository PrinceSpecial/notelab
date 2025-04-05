'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Toaster } from 'sonner'


export default function LoginPage() {
  const [username, setUsername] = useState('')
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('username')
    if (stored) router.push('/notes')
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      localStorage.setItem('username', username.trim())
      router.push('/notes')
    }
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Se connecter</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Entrer
        </button>
      </form>
      <Toaster />
    </main>
  )
}
