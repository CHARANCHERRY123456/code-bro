"use client";
import React, { useEffect, useState, useRef } from "react";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";

export default function ProjectSidebar({ projectId, onSelect, selectedNodeId = null, refresh = 0, onCreated }) {
  const { data: session } = useSession();
  const backendJWT = session?.backendJWT;
  const [items, setItems] = useState([]);
  const [expanded, setExpanded] = useState({}); // id -> bool
  const [childrenMap, setChildrenMap] = useState({}); // id -> []
  const [loadingMap, setLoadingMap] = useState({});
  const [activeAddParent, setActiveAddParent] = useState(null); // null | 'root' | id
  const [addName, setAddName] = useState("");
  const [addType, setAddType] = useState("FILE");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState(null);
  const addInputRef = useRef(null);

  useEffect(() => {
    setChildrenMap({});
    setExpanded({});

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
  }, [backendJWT, projectId, refresh]);

  // focus input when inline add is activated
  useEffect(() => {
    if (activeAddParent && addInputRef.current) {
      try { addInputRef.current.focus(); } catch (e) {}
    }
  }, [activeAddParent]);

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
        <div
          className={`flex items-center justify-between p-1 rounded cursor-pointer ${selectedNodeId === node.id ? "bg-gray-100 dark:bg-slate-700" : "hover:bg-gray-100 dark:hover:bg-slate-700"}`}
          onClick={() => {
            if (isFolder) {
              toggleExpand(node);
              onSelect?.(node);
            } else {
              onSelect?.(node);
            }
          }}
        >
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">{isFolder ? (isExpanded ? "📂" : "📁") : "📄"}</div>
            <div className="text-sm text-gray-800 dark:text-gray-100 truncate" style={{ maxWidth: 188 - depth * 12 }}>{node.name}</div>
          </div>
          <div className="flex items-center gap-2">
            {isFolder && (
              <div className="flex items-center gap-1">
                <button
                  title="Add file inside"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveAddParent(node.id);
                    setAddName("");
                    setAddType("FILE");
                    setAddError(null);
                  }}
                  className="text-xs px-2 py-1 rounded bg-green-500 text-white hover:bg-green-600"
                >
                  📄
                </button>
                <button
                  title="Add folder inside"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveAddParent(node.id);
                    setAddName("");
                    setAddType("FOLDER");
                    setAddError(null);
                  }}
                  className="text-xs px-2 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                >
                  📁
                </button>
              </div>
            )}
            <div className="text-xs text-gray-400">{isFolder ? (loadingMap[node.id] ? "..." : isExpanded ? "-" : "+") : `#${node.id}`}</div>
          </div>
        </div>
        {isFolder && isExpanded && (
          <div className="ml-4">
            {children.length === 0 && <div className="text-xs text-gray-500">(empty)</div>}
            {children.map((c) => renderNode(c, depth + 1))}
            {activeAddParent === node.id && (
              <div className="mt-2 ml-2 p-2 bg-gray-50 dark:bg-slate-700 rounded">
                <div className="flex gap-2 items-center">
                  <input ref={addInputRef} className="px-2 py-1 rounded border w-full text-sm" placeholder="Name" value={addName} onChange={(e) => setAddName(e.target.value)} />
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (!addName) return setAddError("Name required");
                      setAddLoading(true);
                      setAddError(null);
                      try {
                        const res = await api.post(
                          "/node",
                          { projectId: parseInt(projectId), name: addName, type: addType, parentId: node.id },
                          { headers: { Authorization: `Bearer ${backendJWT}` } }
                        );
                        const created = res?.data?.data;
                        // append to children map if loaded
                        setChildrenMap((c) => {
                          const prev = c[node.id] || [];
                          return { ...c, [node.id]: [...prev, created || { id: Date.now(), name: addName, type: addType }] };
                        });
                        setActiveAddParent(null);
                        if (onCreated) onCreated(created);
                      } catch (err) {
                        console.error(err);
                        setAddError(err?.response?.data || err.message || "Failed to create node");
                      } finally {
                        setAddLoading(false);
                      }
                    }}
                    className="px-2 py-1 rounded bg-blue-600 text-white text-sm"
                  >
                    {addLoading ? "Adding..." : `+ Add ${addType === 'FILE' ? 'file' : 'folder'}`}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setActiveAddParent(null); }} className="px-2 py-1 rounded border text-sm">Cancel</button>
                </div>
                {addError && <div className="text-red-600 text-xs mt-1">{String(addError)}</div>}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-100 dark:border-slate-700 p-3 rounded-md">
      <div className="text-sm font-medium mb-2">Explorer</div>
      <div className="mb-2">
        <div
          className={`p-1 rounded cursor-pointer flex items-center justify-between ${selectedNodeId === null ? "bg-gray-100 dark:bg-slate-700" : "hover:bg-gray-100 dark:hover:bg-slate-700"}`}
          onClick={() => onSelect?.(null)}
        >
          <div className="flex items-center gap-2">
            <div className="text-sm">🏠</div>
            <div className="text-sm text-gray-800 dark:text-gray-100">Root</div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <button
                title="Add file in root"
                onClick={(e) => { e.stopPropagation(); setActiveAddParent('root'); setAddName(''); setAddType('FILE'); setAddError(null); }}
                className="text-xs px-2 py-1 rounded bg-green-500 text-white hover:bg-green-600"
              >
                📄
              </button>
              <button
                title="Add folder in root"
                onClick={(e) => { e.stopPropagation(); setActiveAddParent('root'); setAddName(''); setAddType('FOLDER'); setAddError(null); }}
                className="text-xs px-2 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
              >
                📁
              </button>
            </div>
          </div>
        </div>
        {activeAddParent === 'root' && (
          <div className="mt-2 p-2 bg-gray-50 dark:bg-slate-700 rounded">
            <div className="flex gap-2 items-center">
              <input ref={addInputRef} className="px-2 py-1 rounded border w-full text-sm" placeholder="Name" value={addName} onChange={(e) => setAddName(e.target.value)} />
              <button
                onClick={async () => {
                  if (!addName) return setAddError('Name required');
                  setAddLoading(true);
                  setAddError(null);
                  try {
                    const res = await api.post(
                      "/node",
                      { projectId: parseInt(projectId), name: addName, type: addType, parentId: null },
                      { headers: { Authorization: `Bearer ${backendJWT}` } }
                    );
                    const created = res?.data?.data;
                    setItems((it) => [...it, created || { id: Date.now(), name: addName, type: addType }]);
                    setActiveAddParent(null);
                    if (onCreated) onCreated(created);
                  } catch (err) {
                    console.error(err);
                    setAddError(err?.response?.data || err.message || 'Failed to create node');
                  } finally {
                    setAddLoading(false);
                  }
                }}
                className="px-2 py-1 rounded bg-blue-600 text-white text-sm"
              >
                {addLoading ? 'Adding...' : `+ Add ${addType === 'FILE' ? 'file' : 'folder'}`}
              </button>
              <button onClick={() => setActiveAddParent(null)} className="px-2 py-1 rounded border text-sm">Cancel</button>
            </div>
            {addError && <div className="text-red-600 text-xs mt-1">{String(addError)}</div>}
          </div>
        )}
      </div>

      <div className="space-y-1 overflow-auto max-h-[60vh]">
        {items.length === 0 && <div className="text-xs text-gray-500">No files</div>}
        {items.map((n) => renderNode(n))}
      </div>
    </aside>
  );
}
