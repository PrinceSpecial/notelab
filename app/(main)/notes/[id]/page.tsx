"use client"

import { use, useEffect, useState } from "react";
import CollaborativeNote from "@/components/collaborative-notes";

type Params = Promise<{ id: string }>;

export default function NoteDetailPage(props: { params: Params }) {
  const params: { id: string } = use(props.params);

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

  if (!note) return <p>Loading...</p>;

  return (
    <main className="p-4">
      <h1 className="text-xl font-semibold">{note.title}</h1>
      <CollaborativeNote
        noteId={id}
        initialTitle={note.title}
        initialContent={note.content}
      />
    </main>
  );
}
