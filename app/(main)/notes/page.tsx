'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Note {
  id: string
  title: string
  tags: string[]
  // Add any other note fields you need
}

export default function NotesPage() {
  const [username, setUsername] = useState('')
  const [notes, setNotes] = useState<Note[]>([])
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])
  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('')
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
          setFilteredNotes(data) // Initialize filtered notes
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

  const handleNoteClick = (noteId: string) => {
    router.push(`/notes/${noteId}`)
  }

  const handleCreateNote = () => {
    router.push('/notes/new')
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    filterNotes(e.target.value, selectedTag)
  }

  const handleTagFilterChange = (tag: string) => {
    setSelectedTag(tag)
    filterNotes(search, tag)
  }

  const filterNotes = (searchQuery: string, tag: string) => {
    const filtered = notes.filter(note => {
      const titleMatches = note.title.toLowerCase().includes(searchQuery.toLowerCase())
      const tagMatches = tag ? note.tags.includes(tag) : true
      return titleMatches && tagMatches
    })
    setFilteredNotes(filtered)
  }

  if (!username) return null // or a loader

  // Extract unique tags from all notes
  const tags = Array.from(new Set(notes.flatMap(note => note.tags)))

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <button
            onClick={handleCreateNote}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600"
          >
            Nouvelle Note
          </button>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Rechercher par titre"
            className="p-2 border rounded-lg shadow-md w-64"
          />

          <div className="flex gap-2">
            <label className="font-semibold text-gray-700">Filtrer par tag</label>
            <select
              value={selectedTag}
              onChange={(e) => handleTagFilterChange(e.target.value)}
              className="p-2 border rounded-lg shadow-md"
            >
              <option value="">Tous les tags</option>
              {tags.map((tag, index) => (
                <option key={index} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition duration-300 transform hover:scale-105"
              onClick={() => handleNoteClick(note.id)}
            >
              <h2 className="text-xl font-semibold text-gray-800">{note.title}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-600 text-sm px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">Aucune note trouvée</p>
        )}
      </div>
    </div>
  )
}
