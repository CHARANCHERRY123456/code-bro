"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import ProjectSidebar from "./components/ProjectSidebar";

export default function ProjectLayout({ children, params }) {
  const resolvedParams = React.use(params);
  const projectId = resolvedParams?.projectId;
  const { data: session } = useSession();
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    if (!session?.backendJWT || !projectId) return;
    api.get("/node", {
      params: { projectId: parseInt(projectId) },
      headers: { Authorization: `Bearer ${session.backendJWT}` },
    }).then(res => setNodes(res.data?.data || []));
  }, [session?.backendJWT, projectId]);

  return (
    <div className="flex h-screen w-full">
      <div className="w-64 border-r bg-white dark:bg-slate-800 overflow-y-auto">
        <ProjectSidebar nodes={nodes} />
      </div>
      <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900">
        {children}
      </div>
    </div>
  );
}