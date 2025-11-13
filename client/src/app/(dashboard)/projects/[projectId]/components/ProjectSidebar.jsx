"use client";
import { useState } from "react";
import NodeItem from "./NodeItem";
import CreateNodeInput from "./CreateNodeInput";
import { buildTree } from "../utils/treeBuilder";

export default function ProjectSidebar({ nodes = [], onCreateNode }) {
  const [creating, setCreating] = useState(null); // null | "FILE" | "FOLDER"
  const tree = buildTree(nodes);
  
  const handleCreate = (name) => {
    onCreateNode({ parentId: null, type: creating, name });
    setCreating(null);
  };
  
  const cancelCreate = () => {
    setCreating(null);
  };

  return (
    <aside className="h-full p-3 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Explorer
        </h3>
        
        {/* Root Directory Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCreating('FILE')}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="New File"
          >
            <svg
              className="w-4 h-4 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>
          <button
            onClick={() => setCreating('FOLDER')}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="New Folder"
          >
            <svg
              className="w-4 h-4 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-1">
        {/* Create Input for Root */}
        {creating && (
          <CreateNodeInput
            type={creating}
            onSubmit={handleCreate}
            onCancel={cancelCreate}
          />
        )}
        
        {tree.length > 0 ? (
          tree.map((node) => (
            <NodeItem key={node.id} node={node} onCreate={onCreateNode} />
          ))
        ) : (
          !creating && (
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
              No files yet. Create one to get started!
            </div>
          )
        )}
      </div>
    </aside>
  );
}
