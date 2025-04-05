"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

export default function NewNotePage() {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateNote = async () => {
    if (!title) {
      toast.error("Le titre est requis.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/notes", {
        title,
        tags: tags.split(",").map((tag) => tag.trim()),
      });

      const noteId = response.data?.id;
      if (noteId) {
        router.push(`/notes/${noteId}`);
      } else {
        alert("Failed to create note.");
      }
    } catch (err) {
      console.error(err);
        toast.error("Une erreur s'est produite lors de la création de la note.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
        Créer une nouvelle note 📝
      </h1>

      <label className="block mb-2 font-medium">Titre</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded mb-4"
        placeholder="Titre de la note"
      />

      <label className="block mb-2 font-medium">
        Tags (séparés par des virgules)
      </label>
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full border p-2 rounded mb-4"
        placeholder="ex: projet, école, perso"
      />

      <button
        onClick={handleCreateNote}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Création..." : "Créer la note"}
      </button>
    </main>
  );
}
