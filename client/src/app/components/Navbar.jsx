"use client";
import { useTheme } from "next-themes";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();

  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="font-bold text-xl text-blue-600 dark:text-blue-400">CodeBro</div>
      <div className="flex items-center gap-4">
        <button
          className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
        {status === "loading" ? null : session ? (
          <>
            <span className="text-gray-700 dark:text-gray-200">{session.user?.name}</span>
            <button
              className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
              onClick={() => signOut()}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600 transition"
            onClick={() => signIn()}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
