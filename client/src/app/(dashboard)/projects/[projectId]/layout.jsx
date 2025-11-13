"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";

import ProjectSidebar from "./components/ProjectSidebar";
import InviteLink from "./components/InviteLink";

export default function ProjectLayout({ children, params }) {
  const resolvedParams = React.use(params);
  const projectId = resolvedParams?.projectId;
  const { data: session } = useSession();
  const [nodes, setNodes] = useState([]);

  const fetchNodes = async () => {
    if (!session?.backendJWT || !projectId) return;
    try {
      const res = await api.get("/node", {
        params: { projectId: parseInt(projectId) },
        headers: { Authorization: `Bearer ${session.backendJWT}` },
      });
      setNodes(res.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch nodes:", error);
    }
  };

  useEffect(() => {
    fetchNodes();
  }, [session?.backendJWT, projectId]);

  const handleCreateNode = async ({ name, type, parentId }) => {
    if (!session?.backendJWT || !projectId) return;
    try {
      const res = await api.post("/node", {
        name,
        type,
        parentId,
        projectId: parseInt(projectId),
      }, {
        headers: { Authorization: `Bearer ${session.backendJWT}` },
      });
      // Use the backend's returned node directly
      const realNode = res.data?.data;
      setNodes(prev => [...prev, realNode]);
    } catch (error) {
      console.error("Failed to create node:", error);
      alert("Failed to create " + type.toLowerCase());
    }
  };
  
  return (
    <div className="flex h-screen w-full">
      <div className="w-64 border-r bg-white dark:bg-slate-800 overflow-hidden">
        <InviteLink projectId={projectId} />
        <ProjectSidebar nodes={nodes} onCreateNode={handleCreateNode} />
      </div>
      <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900">
        {children}
      </div>
    </div>
  );
}