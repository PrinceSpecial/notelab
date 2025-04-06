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
    <div className="space-y-6">
      {/* Title Input */}
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full px-4 py-3 text-xl font-medium text-gray-800 bg-transparent border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors placeholder:text-gray-400 cursor-text"
          placeholder="Untitled Note..."
        />
      </div>

      {/* Formatting Toolbar */}
      {editor && (
        <div className="flex items-center gap-1 p-1 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-1">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded-md hover:bg-white hover:shadow-sm transition-all cursor-pointer ${
                editor.isActive('bold') 
                  ? 'bg-white shadow-sm text-blue-600' 
                  : 'text-gray-600'
              }`}
              title="Bold"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"></path>
              </svg>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded-md hover:bg-white hover:shadow-sm transition-all cursor-pointer ${
                editor.isActive('italic') 
                  ? 'bg-white shadow-sm text-blue-600' 
                  : 'text-gray-600'
              }`}
              title="Italic"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 4h4M12 4v16M8 20h8"></path>
              </svg>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-2 rounded-md hover:bg-white hover:shadow-sm transition-all cursor-pointer ${
                editor.isActive('underline') 
                  ? 'bg-white shadow-sm text-blue-600' 
                  : 'text-gray-600'
              }`}
              title="Underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v7a5 5 0 0010 0V4M5 20h14"></path>
              </svg>
            </button>
          </div>

          <div className="w-px h-6 bg-gray-200 mx-1"></div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`px-3 py-1.5 rounded-md text-sm font-medium hover:bg-white hover:shadow-sm transition-all cursor-pointer ${
                editor.isActive('heading', { level: 1 }) 
                  ? 'bg-white shadow-sm text-blue-600' 
                  : 'text-gray-600'
              }`}
            >
              H1
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`px-3 py-1.5 rounded-md text-sm font-medium hover:bg-white hover:shadow-sm transition-all cursor-pointer ${
                editor.isActive('heading', { level: 2 }) 
                  ? 'bg-white shadow-sm text-blue-600' 
                  : 'text-gray-600'
              }`}
            >
              H2
            </button>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="prose prose-lg max-w-none">
        <EditorContent 
          editor={editor} 
          className="focus:outline-none cursor-text text-black"
        />
      </div>
    </div>
  )
}
