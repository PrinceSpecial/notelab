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
        userId: localStorage.getItem("username"),
        lastUpdatedBy: localStorage.getItem("username"),
      });

      const noteId = response.data?.id;
      if (noteId) {
        router.push(`/notes/${noteId}`);
      } else {
        toast.error("Échec de la création de la note.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Une erreur s'est produite lors de la création de la note.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                Nouvelle Note ✨
              </h1>
              <button
                onClick={() => router.push('/notes')}
                className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              >
                ← Retour
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Title Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Titre de la note
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 text-gray-900 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  placeholder="Ex: Mes idées de projet..."
                />
              </div>

              {/* Tags Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-3 text-gray-900 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  placeholder="projet, idées, personnel..."
                />
                <p className="text-sm text-gray-500">
                  Séparez les tags par des virgules
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-4">
              <button
                onClick={() => router.push('/notes')}
                className="px-6 py-2.5 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateNote}
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Création...
                  </span>
                ) : (
                  "Créer la note"
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
