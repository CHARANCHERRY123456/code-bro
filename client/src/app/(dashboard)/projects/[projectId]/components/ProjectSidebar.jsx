"use client";
import NodeItem from "./NodeItem";
import { buildTree } from "../utils/treeBuilder";

export default function ProjectSidebar({ nodes = [], onCreateNode }) {
  const tree = buildTree(nodes);

  return (
    <aside className="h-full p-3 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Explorer
        </h3>
      </div>

      <div className="space-y-1">
        {tree.length > 0 ? (
          tree.map((node) => (
            <NodeItem key={node.id} node={node} onCreate={onCreateNode} />
          ))
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
            No files yet. Create one to get started!
          </div>
        )}
      </div>
    </aside>
  );
}
