"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, File, Folder, Plus } from "lucide-react";
import CreateNodeInput from "./CreateNodeInput";

export default function NodeItem({ node, onCreate }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [creating, setCreating] = useState(null); // null | "FILE" | "FOLDER"

  const isFolder = node.type === "FOLDER";
  const hasChildren = node.children && node.children.length > 0;

  const handleClick = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      router.push(`/projects/${node.projectId}/${node.id}`);
    }
  };

  const startCreate = (type) => {
    setIsOpen(true);
    setCreating(type);
  };

  const handleCreate = (name) => {
    onCreate({ parentId: node.id, type: creating, name });
    setCreating(null);
  };

  const cancelCreate = () => {
    setCreating(null);
  };

  return (
    <div className="select-none">
      {/* Node Header */}
      <div className="flex items-center justify-between px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded group">
        <div className="flex items-center gap-1.5 flex-1 cursor-pointer" onClick={handleClick}>
          {/* Expand/Collapse Icon */}
          {isFolder && (
            <span className="text-gray-500 dark:text-gray-400">
              {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          )}
          {!isFolder && <span className="w-3.5" />}
          
          {/* Folder/File Icon */}
          {isFolder ? (
            <Folder size={16} className="text-yellow-500 dark:text-yellow-400" />
          ) : (
            <File size={16} className="text-blue-500 dark:text-blue-400" />
          )}
          
          {/* Node Name */}
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
            {node.name}
          </span>
        </div>

        {/* Action Buttons (show on hover) */}
        {isFolder && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                startCreate("FILE");
              }}
              title="New File"
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Plus size={14} className="text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                startCreate("FOLDER");
              }}
              title="New Folder"
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Folder size={14} className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        )}
      </div>

      {/* Children & Create Input */}
      {isFolder && isOpen && (
        <div className="ml-4 border-l border-gray-200 dark:border-gray-700 pl-1 space-y-0.5">
          {/* Create Input */}
          {creating && (
            <CreateNodeInput
              type={creating}
              onSubmit={handleCreate}
              onCancel={cancelCreate}
            />
          )}

          {/* Child Nodes */}
          {hasChildren ? (
            node.children.map((child) => (
              <NodeItem key={child.id} node={child} onCreate={onCreate} />
            ))
          ) : (
            !creating && (
              <div className="text-xs text-gray-400 dark:text-gray-500 px-2 py-1 italic">
                Empty folder
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
