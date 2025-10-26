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
      <h2 className="text-xl font-bold mb-4">Projects List</h2>
      <ProjectForm backendJWT={session?.backendJWT} onCreated={fetchProjects} />
      <ProjectList projects={projects} />
    </div>
  );
}