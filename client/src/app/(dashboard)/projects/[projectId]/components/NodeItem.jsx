"use client";

import { useRouter } from "next/navigation";

export default function NodeItem({ node }) {
  const router = useRouter();
  function handleClick(){
    if(node.type === "FOLDER"){
      // expand or collapse folder
      return;
    }
    router.push(`/projects/${node.projectId}/${node.id}`);
  }
  return (
    <div 
      onClick={handleClick}
      className="p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-gray-800 dark:text-gray-200 text-sm"
    >
      {node.type === "FOLDER" ? "📁" : "📄"} {node.name}
    </div>
  );
}
