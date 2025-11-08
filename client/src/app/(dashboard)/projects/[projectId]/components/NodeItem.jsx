"use client";
export default function NodeItem({ node }) {
  return (
    <div className="p-1">
      {node.type === "FOLDER" ? "📁" : "📄"} {node.name}
    </div>
  );
}
