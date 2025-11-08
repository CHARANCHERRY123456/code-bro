"use client";
import NodeItem from "./NodeItem";

export default function ProjectSidebar({ nodes = [] }) {
  return (
    <aside className="p-3">
      <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Files</h3>
      <div className="space-y-1">
        {nodes.map(node => <NodeItem key={node.id} node={node} />)}
      </div>
    </aside>
  );
}