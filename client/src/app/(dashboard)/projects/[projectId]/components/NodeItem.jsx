"use client";
import { useState } from "react";
import { ChevronDown, ChevronRight, File, Folder } from "lucide-react";

export default function NodeItem({ node }) {
  const [open, setOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  const toggle = () => {
    if (hasChildren) setOpen(!open);
  };
  const createNode = () => {
    console.log(node , "parent id = " , node.id , "file name = ");
    
  }
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all">
      {/* Header */}
      <div
        onClick={toggle}
        className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
      >
        <div className="flex items-center space-x-2">
          {hasChildren ? (
            open ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          ) : (
            <span className="w-[14px]" />
          )}
          {node.type === "FOLDER" ? (
            <Folder size={15} className="text-yellow-500" />
          ) : (
            <File size={15} className="text-blue-500" />
          )}
          <span  className="text-sm font-medium">{node.name}</span>
        </div>
      </div>

      {/* Content */}
      {open && hasChildren && (
        <div className="p-2 space-y-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
          {node.children.map(child => (
            <NodeItem key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}
