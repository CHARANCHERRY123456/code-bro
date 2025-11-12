"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight, File, Folder, Plus } from "lucide-react";

export default function NodeItem({ node, onCreate }) {
  const [open, setOpen] = useState(Boolean(node.children && node.children.length));
  const [creating, setCreating] = useState(null); // null | "FILE" | "FOLDER"
  const inputRef = useRef(null);

  useEffect(() => {
    if (creating && inputRef.current) inputRef.current.focus();
  }, [creating]);

  const hasChildren = node.children && node.children.length > 0;

  const startCreate = type => {
    setOpen(true);
    setCreating(type);
  };

  const cancelCreate = () => setCreating(null);

  const submitCreate = (type, value) => {
    const name = (value || "").trim();
    if (!name) {
      cancelCreate();
      return;
    }
    onCreate({ parentId: node.id, type, name });
    cancelCreate();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 cursor-default hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg">
        <div className="flex items-center gap-2">
          {hasChildren ? (open ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <span className="w-4" />}
          {node.type === "FOLDER" ? <Folder size={15} className="text-yellow-500" /> : <File size={15} className="text-blue-500" />}
          <span className="text-sm font-medium">{node.name}</span>
        </div>

        {/* actions (small plus) */}
        {node.type === "FOLDER" && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => startCreate("FILE")}
              title="New File"
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Plus size={14} />
            </button>
            <button
              onClick={() => startCreate("FOLDER")}
              title="New Folder"
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Plus size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Content (children + creation input) */}
      {open && (
        <div className="p-2 space-y-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
          {/* creation input */}
          {creating && (
            <div className="flex items-center gap-2">
              <div className="w-4" /> {/* align with icons */}
              <input
                ref={inputRef}
                className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-1 rounded text-sm"
                placeholder={creating === "FOLDER" ? "New folder name" : "New file name"}
                onKeyDown={e => {
                  if (e.key === "Enter") submitCreate(creating, e.target.value);
                  if (e.key === "Escape") cancelCreate();
                }}
                onBlur={e => {
                  if (e.target.value && e.target.value.trim()) submitCreate(creating, e.target.value);
                  else cancelCreate();
                }}
              />
            </div>
          )}

          {/* children */}
          {hasChildren ? (
            node.children.map(child => <NodeItem key={child.id} node={child} onCreate={onCreate} />)
          ) : (
            <div className="text-xs text-gray-500">Empty</div>
          )}
        </div>
      )}
    </div>
  );
}
