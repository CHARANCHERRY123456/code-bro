"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import NodeItem from "./NodeItem";

export default function SideBar({ projectId }) {
  const { data: session } = useSession();
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    if (!session?.backendJWT) return;
    api.get("/node", {
      params: { projectId: parseInt(projectId) },
      headers: { Authorization: `Bearer ${session.backendJWT}` },
    }).then(res => setNodes(res.data?.data || []));
  }, [session?.backendJWT, projectId]);

  return <>
    <aside className="w-64 p-3">
      {nodes.map(node => <NodeItem key={node.id} node={node} />)}
    </aside>
  </>;
}