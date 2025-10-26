"use client"
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  console.log(session , "is the sesison");
  
  if (status === "loading") {
    return <div className="p-8">Loading...</div>;
  }
  return (
    <div className="p-8">
      {!session ? (
        <div>
          <button 
            onClick={() => signIn("google")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Sign in with Google
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-4">Welcome {session?.user?.name}</p>
          <p className="text-sm text-gray-600 mb-4">Email: {session?.user?.email}</p>
          {session.backendJWT && (
            <p className="text-xs text-green-600 mb-4">✅ Backend authenticated</p>
          )}
          <button 
            onClick={() => signOut()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
