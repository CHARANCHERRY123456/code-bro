"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";

export default function ProjectSidebar({ projectId, onSelect }) {
  const { data: session } = useSession();
  const backendJWT = session?.backendJWT;
  const [items, setItems] = useState([]);
  const [expanded, setExpanded] = useState({}); // id -> bool
  const [childrenMap, setChildrenMap] = useState({}); // id -> []
  const [loadingMap, setLoadingMap] = useState({});

  useEffect(() => {
    async function loadRoot() {
      if (!backendJWT) return;
      try {
        const res = await api.get("/node", {
          params: { projectId },
          headers: { Authorization: `Bearer ${backendJWT}` },
        });
        setItems(res.data.data || []);
      } catch (err) {
        console.error("sidebar load root", err);
      }
    }
    loadRoot();
  }, [backendJWT, projectId]);

  async function toggleExpand(node) {
    if (!node || node.type !== "FOLDER") return;
    const id = node.id;
    const isExpanded = !!expanded[id];
    if (isExpanded) {
      setExpanded((s) => ({ ...s, [id]: false }));
      return;
    }
    // expand: fetch children if not present
    if (childrenMap[id]) {
      setExpanded((s) => ({ ...s, [id]: true }));
      return;
    }
    setLoadingMap((m) => ({ ...m, [id]: true }));
    try {
      const res = await api.get("/node", {
        params: { projectId, parentId: id },
        headers: { Authorization: `Bearer ${backendJWT}` },
      });
      setChildrenMap((c) => ({ ...c, [id]: res.data.data || [] }));
      setExpanded((s) => ({ ...s, [id]: true }));
    } catch (err) {
      console.error("failed to load children", err);
    } finally {
      setLoadingMap((m) => ({ ...m, [id]: false }));
    }
  }

  function renderNode(node, depth = 0) {
    const isFolder = node.type === "FOLDER";
    const isExpanded = !!expanded[node.id];
    const children = childrenMap[node.id] || [];
    return (
      <div key={node.id} className="pl-2">
        <div className="flex items-center justify-between p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
             onClick={() => (isFolder ? toggleExpand(node) : onSelect?.(node))}>
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">{isFolder ? (isExpanded ? "📂" : "📁") : "📄"}</div>
            <div className="text-sm text-gray-800 dark:text-gray-100 truncate" style={{ maxWidth: 220 - depth * 12 }}>{node.name}</div>
          </div>
          <div className="text-xs text-gray-400">{isFolder ? (loadingMap[node.id] ? "..." : isExpanded ? "-" : "+") : `#${node.id}`}</div>
        </div>
        {isFolder && isExpanded && (
          <div className="ml-4">
            {children.length === 0 && <div className="text-xs text-gray-500">(empty)</div>}
            {children.map((c) => renderNode(c, depth + 1))}
          </div>
        )}
      </div>
    );
  }

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-100 dark:border-slate-700 p-3 rounded-md">
      <div className="text-sm font-medium mb-2">Explorer</div>
      <div className="space-y-1 overflow-auto max-h-[60vh]">
        {items.length === 0 && <div className="text-xs text-gray-500">No files</div>}
        {items.map((n) => renderNode(n))}
      </div>
    </aside>
  );
}
