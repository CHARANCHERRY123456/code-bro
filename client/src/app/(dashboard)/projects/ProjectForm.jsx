"use client";
import { useState } from "react";
import api from "@/lib/axios";

export default function ProjectForm({ backendJWT, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      await api.post(
        "/project",
        { name, description },
        {
          headers: { Authorization: `Bearer ${backendJWT}` },
        }
      );
      setName("");
      setDescription("");
      if (onCreated) onCreated();
    } catch (err) {
      setError(err.message || "Failed to create project");
    } finally {
      setCreating(false);
    }
  }

  return (
    <form onSubmit={handleCreate} className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col md:flex-row gap-3 items-start">
        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={creating}
        >
          {creating ? "Creating..." : "Create"}
        </button>
      </div>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
}
