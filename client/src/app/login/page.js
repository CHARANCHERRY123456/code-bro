"use client"
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleCredentials(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    setLoading(false);
    if (res?.error) {
      setError(res.error || "Login failed");
    } else {
      // successful - redirect to dashboard
      window.location.href = "/projects";
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <div className="space-y-4">
        <button
          onClick={() => signIn("google")}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Sign in with Google
        </button>

        <form onSubmit={handleCredentials} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in with Email"}
            </button>
          </div>
          {error && <div className="text-red-600">{error}</div>}
        </form>
      </div>
    </div>
  );
}
