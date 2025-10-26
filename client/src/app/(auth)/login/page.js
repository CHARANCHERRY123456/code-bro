"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    console.log("🚀 [LOGIN PAGE] Starting login...", { email });
    setLoading(true);
    
    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/projects",
    });
    
    console.log("📥 [LOGIN PAGE] Login result:", result);
    
    if (!result?.ok && result?.error) {
      console.log("❌ [LOGIN PAGE] Login failed:", result?.error);
      alert("Invalid credentials. Try:\ntest@example.com / 1234\nadmin@example.com / admin");
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Login</h1>
      <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
        Demo users:<br/>
        • test@example.com / 1234<br/>
        • admin@example.com / admin
      </p>
      
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: "10px", 
            background: loading ? "#ccc" : "#0070f3", 
            color: "white", 
            border: "none", 
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
