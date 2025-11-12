"use client";
import { useRef, useEffect } from "react";

export default function CreateNodeInput({ type, onSubmit, onCancel }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (value) => {
    const name = (value || "").trim();
    if (name) {
      onSubmit(name);
    } else {
      onCancel();
    }
  };

  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <div className="w-4" /> {/* align with icons */}
      <input
        ref={inputRef}
        className="flex-1 bg-white dark:bg-gray-800 border border-blue-500 dark:border-blue-400 px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={type === "FOLDER" ? "Folder name..." : "File name..."}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit(e.target.value);
          }
          if (e.key === "Escape") {
            onCancel();
          }
        }}
        onBlur={(e) => {
          handleSubmit(e.target.value);
        }}
      />
    </div>
  );
}
