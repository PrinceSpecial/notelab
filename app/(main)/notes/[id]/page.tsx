"use client"

import { use, useEffect, useState } from "react";
import CollaborativeNote from "@/components/collaborative-notes";
import { useRouter } from "next/navigation";

type Params = Promise<{ id: string }>;

export default function NoteDetailPage(props: { params: Params }) {
  const params: { id: string } = use(props.params);
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const id = params.id;

  useEffect(() => {
    if (id) {
      const fetchNote = async () => {
        const res = await fetch(`/api/notes/${id}`);
        if (res.ok) {
          const data = await res.json();
          setNote(data);
        } else {
          console.error("Failed to fetch note");
        }
      };
      fetchNote();
    }
  }, [id]);

  if (!note) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-gray-600 font-medium">Loading note...</div>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/notes')}
            className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer"
          >
            <span className="mr-2">←</span> Retour aux notes
          </button>
          <div className="h-6 w-px bg-gray-200"></div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-600">
              Dernière modification à {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-white flex items-center justify-center shadow-sm">
              <span className="text-xs text-white font-medium">JD</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 border-2 border-white flex items-center justify-center shadow-sm">
              <span className="text-xs text-white font-medium">AB</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-gray-700">2 collaborateurs en ligne</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200">
        <div className="p-8">
          <CollaborativeNote
            noteId={id}
            initialTitle={note.title}
            initialContent={note.content}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-center items-center space-x-2">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
        <span className="text-sm text-gray-600">
          Modifications enregistrées automatiquement
        </span>
      </div>
    </main>
  );
}

