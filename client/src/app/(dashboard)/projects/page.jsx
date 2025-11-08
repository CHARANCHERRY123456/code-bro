"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import ProjectList from "./ProjectList";
import ProjectForm from "./ProjectForm";

export default function ProjectsPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    
    if (!session?.backendJWT) return;

    try {
      setLoading(true);
      const res = await api.get("/project", {
        headers: { Authorization: `Bearer ${session.backendJWT}` },
      });
      setProjects(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [session?.backendJWT]);

  if (loading) return <div className="p-8">Loading projects...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <p className="text-sm text-gray-500">Manage your projects and members</p>
      </header>

      <ProjectForm backendJWT={session?.backendJWT} onCreated={fetchProjects} />
      <ProjectList projects={projects} />
    </div>
  );
}
