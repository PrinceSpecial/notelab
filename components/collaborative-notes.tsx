'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'

type SocketMessage = {
  noteId: string
  title: string
  content: string
}

export default function CollaborativeNote({
  noteId,
  initialTitle,
  initialContent,
}: {
  noteId: string
  initialTitle: string
  initialContent: string
}) {
  const [title, setTitle] = useState(initialTitle)
  const [socket, setSocket] = useState<any>(null)

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: initialContent,
    onUpdate({ editor }) {
      const newContent = editor.getHTML()
      socket?.emit('note:update', { noteId, title, content: newContent })
    },
  })

  useEffect(() => {
    const socketIo = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000')
  
    socketIo.on('connect', () => {
      console.log('✅ Connected to Socket.IO server')
    })
  
    socketIo.on('note:update', (data: SocketMessage) => {
      if (data.noteId === noteId && editor) {
        if (data.title !== title) setTitle(data.title)
        if (data.content !== editor.getHTML()) {
          editor.commands.setContent(data.content)
        }
      }
    })
  
    setSocket(socketIo)
  
    return () => {
      socketIo.disconnect()
    }
  }, [noteId, editor])
  

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    if (socket) {
      socket.emit('note:update', {
        noteId,
        title: newTitle,
        content: editor?.getHTML() || '',
      })
    }
  }

  return (
    <div className="p-4">
      <label className="block font-medium text-gray-700 mb-2">Note Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      {/* Toolbar */}
      {editor && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-2 py-1 rounded border ${
              editor.isActive('bold') ? 'bg-black text-white' : ''
            }`}
          >
            Bold
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-2 py-1 rounded border ${
              editor.isActive('italic') ? 'bg-black text-white' : ''
            }`}
          >
            Italic
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`px-2 py-1 rounded border ${
              editor.isActive('underline') ? 'bg-black text-white' : ''
            }`}
          >
            Underline
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-2 py-1 rounded border ${
              editor.isActive('heading', { level: 1 }) ? 'bg-black text-white' : ''
            }`}
          >
            H1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-2 py-1 rounded border ${
              editor.isActive('heading', { level: 2 }) ? 'bg-black text-white' : ''
            }`}
          >
            H2
          </button>
        </div>
      )}

      {/* Editor Content */}
      <div className="border rounded p-2 flex-1">
        {/* Set the EditorContent height to 100% of the parent */}
        <EditorContent editor={editor} className="w-full h-full" />
      </div>
    </div>
  )
}
