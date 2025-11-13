"use client";

import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import { useState } from "react";

export default function InviteLink({ projectId }) {
  const [invite, setInvite] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { data: session } = useSession();

  const createInvite = async () => {
    setLoading(true);
    setError("");
    setCopied(false);
    try {
      const res = await api.post(
        `/invite/${projectId}`,
        {},
        session?.backendJWT
          ? { headers: { Authorization: `Bearer ${session.backendJWT}` } }
          : undefined
      );
      setInvite(res.data.data);
    } catch (err) {
      setError("Failed to create invite.");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (!invite?.token) return;
    const link = `${window.location.origin}/invite/${invite.token}/join`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="my-4 p-4 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
      <button
        onClick={createInvite}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Invite Link"}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {invite && (
        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            value={`${window.location.origin}/invite/${invite.token}/join`}
            readOnly
            className="w-full px-2 py-1 border rounded bg-gray-100 dark:bg-gray-900 text-xs"
          />
          <button
            onClick={copyLink}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}
