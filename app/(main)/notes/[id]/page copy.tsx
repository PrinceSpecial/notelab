"use client";

import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

type Params = Promise<{ id: string }>;

export default function NoteDetailPage(props: { params: Params }) {
  const params: { id: string } = use(props.params);

  const [note, setNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const router = useRouter();
  const id = params.id;

  useEffect(() => {
    if (id) {
      const fetchNote = async () => {
        try {
          const res = await fetch(`/api/notes/${id}`);
          if (res.ok) {
            const data = await res.json();
            setNote(data);
          } else {
            console.error("Failed to fetch note");
          }
        } catch (error) {
          console.error("Error fetching note:", error);
        }
      };

      fetchNote();
    }
  }, [id]);

  const handleSave = async () => {
    if (note) {
      try {
        const res = await fetch(`/api/notes/${id}`, {
          method: "PUT",
          body: JSON.stringify({ title: note.title, content: note.content }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          setIsEditing(false); // Switch back to view mode after saving
        } else {
          console.error("Failed to save note");
        }
      } catch (error) {
        console.error("Error saving note:", error);
      }
    }
  };

  if (!note) return <p>Loading...</p>;

  return (
    <main className="p-4">
      {isEditing ? (
        <>
          <h1 className="text-xl font-semibold">
            <input
              type="text"
              value={note.title}
              onChange={(e) => setNote({ ...note, title: e.target.value })}
              className="text-xl font-semibold w-full border-b-2 focus:outline-none"
            />
          </h1>

          <div className="mt-4">
            <CKEditor
              editor={ClassicEditor}
              data={note.content}
              onChange={(event, editor) => {
                const data = editor.getData();
                setNote({ ...note, content: data });
              }}
            />
          </div>

          <div className="mt-4">
            <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-xl font-semibold">{note.title}</h1>
          <div className="mt-4" dangerouslySetInnerHTML={{ __html: note.content }}></div> {/* Display content in read mode */}
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
          >
            Edit
          </button>
        </>
      )}
    </main>
  );
}
