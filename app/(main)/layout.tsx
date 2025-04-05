'use client'
import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Toaster, toast } from 'sonner'

interface LayoutProps {
  children: ReactNode
  username: string
}

export default function NotesLayout({ children, username }: LayoutProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('username')
    router.push('/login')
    toast.success('You have logged out successfully')
  }

  const navigateToNotes = () => {
    router.push('/notes') // Navigate to the list of notes
  }

  return (
    <main className="min-h-screen p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Bienvenue {username} 👋</h1>
        
        <div className="flex items-center gap-4">
          {/* Mes Notes Button */}
          <button
            onClick={navigateToNotes}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Mes Notes
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {children}
      <Toaster />
    </main>
  )
}
