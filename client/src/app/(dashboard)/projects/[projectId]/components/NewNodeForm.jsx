"use client";
import React, { useState } from "react";
import api from "@/lib/axios";

export default function NewNodeForm({ projectId, backendJWT, onCreated, parentId = null }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("FILE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name) return;
    setLoading(true);
    setError(null);
    try {
      await api.post(
        "/node",
        { projectId: parseInt(projectId), name, type, parentId: parentId ? parseInt(parentId) : null },
        { headers: { Authorization: `Bearer ${backendJWT}` } }
      );
      setName("");
      setType("FILE");
      if (onCreated) onCreated();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data || err.message || "Failed to create node");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex gap-2 items-center">
        <input
          className="px-3 py-2 border rounded w-1/3 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-slate-600"
          placeholder="Name (e.g. README.md or src)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-3 py-2 border rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-slate-600"
        >
          <option value="FILE">File</option>
          <option value="FOLDER">Folder</option>
        </select>
        <button
          type="submit"
          className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition"
          disabled={loading || !backendJWT}
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>
      {error && <div className="text-red-600 dark:text-red-400 mt-2">{JSON.stringify(error)}</div>}
    </form>
  );
}
