"use client";
import { useState, useEffect } from "react";
import NodeItem from "./NodeItem";
import { buildTree, insertNode, generateId } from "./sidebar/utils/treeBuilder";

export default function ProjectSidebar({ nodes = [] }) {
  const [tree, setTree] = useState([]);

  useEffect(() => {
    setTree(buildTree(nodes));
  }, [nodes]);

  const handleCreate = ({ parentId = null, type = "FILE", name }) => {
    if (!name || !name.trim()) return;
    const newNode = {
      id: generateId(),
      name: name.trim(),
      type,
      parentId,
      children: type === "FOLDER" ? [] : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTree(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      insertNode(next, parentId, newNode);
      return next;
    });
  };

  return (
    <aside className="p-3 max-h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Files</h3>
      </div>

      <div className="space-y-2">
        {tree.map(node => (
          <NodeItem key={node.id} node={node} onCreate={handleCreate} />
        ))}
      </div>
    </aside>
  );
}
