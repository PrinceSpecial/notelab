"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

interface LayoutProps {
  children: ReactNode;
}

export default function NotesLayout({ children }: LayoutProps) {
  const router = useRouter();

  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    router.push("/login");
    toast.success("You have logged out successfully");
  };

  const navigateToNotes = () => {
    router.push("/notes");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">NoteLab</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              Bonjour, <span className="font-medium">{username}</span> 👋
            </span>
            <button
              onClick={navigateToNotes}
              className="bg-white text-blue-500 border border-blue-500 px-4 py-2 rounded-full hover:bg-blue-50 transition-colors cursor-pointer"
            >
              Notes
            </button>
            <button
              onClick={handleLogout}
              className="bg-white text-red-500 border border-red-500 px-4 py-2 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {children}
      <Toaster />
    </div>
  );
}
