'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function NotesPage() {
  const [username, setUsername] = useState('')
  const [notes, setNotes] = useState<Note[]>([])
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('username')
    if (!stored) router.push('/login')
    else setUsername(stored)
  }, [router])

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch('/api/notes')
        if (res.ok) {
          const data = await res.json()
          setNotes(data)
        } else {
          toast.error('Failed to fetch notes')
        }
      } catch (error) {
        toast.error('Error fetching notes')
      }
    }

    if (username) fetchNotes()
  }, [username])

  const handleLogout = () => {
    localStorage.removeItem('username')
    router.push('/login')
  }

  const handleNoteClick = (noteId : string) => {
    router.push(`/notes/${noteId}`)
  }

  if (!username) return null // or a loader

  return (
    <main className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Bienvenue {username} 👋</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Déconnexion
        </button>
      </div>

      <div>
        {notes.length > 0 ? (
          <ul>
            {notes.map((note) => (
              <li
                key={note.id}
                className="p-4 border-b cursor-pointer hover:bg-gray-100"
                onClick={() => handleNoteClick(note.id)}
              >
                {note.title} {/* Customize this with the note's title or content */}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune note trouvée</p>
        )}
      </div>
    </main>
  )
}
