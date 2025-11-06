"use client";
import React from "react";

export default function NodeList({ nodes = [] }) {
  if (!nodes || nodes.length === 0) {
    return <div className="text-sm text-gray-500">No files or folders.</div>;
  }

  return (
    <ul className="space-y-3">
      {nodes.map((n) => (
        <li
          key={n.id}
          className="p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-md flex items-start justify-between"
        >
          <div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                {n.type === "FOLDER" ? "📁" : "📄"}
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">{n.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Role: {n.projectRole || "—"}</div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
