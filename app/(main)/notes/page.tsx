"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NotesPage() {
  const [username, setUsername] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (!stored) router.push("/login");
    else setUsername(stored);
  }, [router]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("/api/notes");
        if (res.ok) {
          const data = await res.json();
          setNotes(data);
        } else {
          toast.error("Failed to fetch notes");
        }
      } catch (error) {
        toast.error("Error fetching notes");
      }
    };

    if (username) fetchNotes();
  }, [username]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    router.push("/login");
  };

  const handleNoteClick = (noteId: string) => {
    router.push(`/notes/${noteId}`);
  };

  const handleCreateNote = () => {
    router.push("/notes/new");
  };

  if (!username) return null;

  return (
    

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-gray-800">Mes Notes</h2>
          <button
            onClick={handleCreateNote}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
          >
            Nouvelle Note
          </button>
        </div>

        {notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => handleNoteClick(note.id)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 cursor-pointer border border-gray-100"
              >
                <h3 className="font-medium text-lg text-gray-800 mb-2 truncate">
                  {note.title}
                </h3>
                {note.content && (
                  <p
                    className="text-gray-500 text-sm line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html:
                        note.content.length > 100
                          ? note.content.slice(0, 100) + "..."
                          : note.content,
                    }}
                  />
                )}
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                  {/* <span className="text-xs text-gray-400">Last edited: {note.updatedAt}</span> */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-6">Aucune note trouvée</p>
            <p className="text-gray-400 text-sm">
              Créez votre première note en cliquant sur "Nouvelle Note"
            </p>
          </div>
        )}
      </main>
  );
}
