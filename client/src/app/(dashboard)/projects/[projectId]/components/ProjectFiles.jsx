"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import NewNodeForm from "./NewNodeForm";
import ProjectSidebar from "./ProjectSidebar";

export default function ProjectFiles({ projectId }) {
  const { data: session } = useSession();
  const backendJWT = session?.backendJWT;
  const [nodes, setNodes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  async function fetchNodes(parentId = null) {
    if (!backendJWT) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/node", {
        params: { projectId, parentId },
        headers: { Authorization: `Bearer ${backendJWT}` },
      });
      setNodes(res.data.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data || err.message || "Failed to fetch nodes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNodes(selectedNode ? selectedNode.id : null);
  }, [backendJWT, projectId, selectedNode]);

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Files & Folders</h2>
      </div>

      <div className="flex gap-4">
        <ProjectSidebar projectId={projectId} onSelect={(node) => setSelectedNode(node)} />

        <main className="flex-1">
          <div className="mb-4">
            <NewNodeForm projectId={projectId} backendJWT={backendJWT} parentId={selectedNode?.id} onCreated={() => fetchNodes(selectedNode ? selectedNode.id : null)} />
          </div>

          {loading && <div>Loading files...</div>}
          {error && <pre className="text-red-600 dark:text-red-400">{JSON.stringify(error, null, 2)}</pre>}

        </main>
      </div>
    </div>
  );
}
