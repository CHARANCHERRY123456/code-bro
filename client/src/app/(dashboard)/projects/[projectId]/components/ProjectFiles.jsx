"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import NodeList from "./NodeList";
import NewNodeForm from "./NewNodeForm";

export default function ProjectFiles({ projectId }) {
  const { data: session } = useSession();
  const backendJWT = session?.backendJWT;
  const [nodes, setNodes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchNodes() {
    if (!backendJWT) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/node", {
        params: { projectId },
        headers: { Authorization: `Bearer ${backendJWT}` },
      });
      setNodes(res.data.data);
      console.log("project nodes:", res.data.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data || err.message || "Failed to fetch nodes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNodes();
  }, [backendJWT, projectId]);

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Files & Folders</h2>
        <div className="text-sm text-gray-500">(logged to console)</div>
      </div>

      <div className="mb-4">
        <NewNodeForm projectId={projectId} backendJWT={backendJWT} onCreated={fetchNodes} />
      </div>

      {loading && <div>Loading files...</div>}
      {error && <pre className="text-red-600 dark:text-red-400">{JSON.stringify(error, null, 2)}</pre>}

      {nodes && <NodeList nodes={nodes} />}
      {!nodes && !loading && <div className="text-sm text-gray-500">No files loaded yet.</div>}
    </div>
  );
}
