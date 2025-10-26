"use client"
import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div className="p-8">Loading...</div>;
  }
  return (
    <div className="p-8">
        <div>
          <p className="mb-4">Welcome {session?.user?.name}</p>
          <p className="text-sm text-gray-600 mb-4">Email: {session?.user?.email}</p>
          <button
            onClick={() => signOut()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Sign out
          </button>
        </div>
    </div>
  );
}
