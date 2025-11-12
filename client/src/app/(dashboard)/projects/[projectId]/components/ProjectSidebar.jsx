"use client";
import NodeItem from "./NodeItem";

export default function ProjectSidebar({ nodes = [] }) {
  const tree = buildTree(nodes);

  return (
    <aside className="p-3 max-h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
        Files
      </h3>
      <div className="space-y-2">
        {tree.map(node => (
          <NodeItem key={node.id} node={node} />
        ))}
      </div>
    </aside>
  );
}

function buildTree(nodes) {
  const map = {};
  const roots = [];
  nodes.forEach(n => (map[n.id] = { ...n, children: [] }));
  nodes.forEach(n => {
    if (n.parentId) map[n.parentId]?.children.push(map[n.id]);
    else roots.push(map[n.id]);
  });
  return roots;
}
