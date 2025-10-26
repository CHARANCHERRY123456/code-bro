"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function ProjectsPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("📄 [PROJECTS PAGE] Component mounted");
    console.log("📄 [PROJECTS PAGE] Session status:", status);
    console.log("📄 [PROJECTS PAGE] Session data:", session);
  }, [session, status]);

  const handleLogout = async () => {
    console.log("🚪 [PROJECTS PAGE] Logout clicked");
    await signOut({ redirect: false });
    console.log("✅ [PROJECTS PAGE] Logout successful, redirecting to /login");
    window.location.href = "/login";
  };

  if (status === "loading") {
    console.log("⏳ [PROJECTS PAGE] Loading session...");
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  if (!session) {
    console.log("❌ [PROJECTS PAGE] No session found, user not authenticated");
    return (
      <div style={{ padding: "20px" }}>
        <p>Not authenticated. Please <a href="/login">login</a>.</p>
      </div>
    );
  }

  console.log("✅ [PROJECTS PAGE] User authenticated:", session.user);

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Projects Dashboard</h1>
      
      <div style={{ 
        background: "#f5f5f5", 
        padding: "20px", 
        borderRadius: "8px", 
        marginTop: "20px" 
      }}>
        <h3>User Info:</h3>
        <p><strong>ID:</strong> {session.user?.id}</p>
        <p><strong>Name:</strong> {session.user?.name}</p>
        <p><strong>Email:</strong> {session.user?.email}</p>
      </div>

      <button 
        onClick={handleLogout}
        style={{ 
          marginTop: "20px",
          padding: "10px 20px", 
          background: "#ff4444", 
          color: "white", 
          border: "none", 
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Logout
      </button>
    </div>
  );
}
