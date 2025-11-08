"use client";
import ProjectList from "./ProjectList";
import ProjectForm from "./ProjectForm";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ProjectsPage() {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function fetchProjects() {
    setLoading(true);
    setError(null);
    import("@/lib/axios")
      .then(({ default: api }) => {
        api
          .get("/project", {
            headers: { Authorization: `Bearer ${session?.backendJWT}` },
          })
          .then((res) =>
            setProjects(Array.isArray(res.data.data) ? res.data.data : [])
          )
          .catch((err) => setError(err.message || "Failed to fetch projects"))
          .finally(() => setLoading(false));
      })
      .catch((err) => setError(err.message || "Failed to load API"));
  }

  useEffect(() => {
    if (session?.backendJWT) fetchProjects();
  }, [session]);

  if (loading) return <div className="p-8">Loading projects...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Projects</h2>
          <p className="text-sm text-gray-500">Manage your projects and members</p>
        </div>

        <div className="mb-6">
          <ProjectForm backendJWT={session?.backendJWT} onCreated={fetchProjects} />
        </div>

        <ProjectList projects={projects} />
      </div>
    </div>
  );
}