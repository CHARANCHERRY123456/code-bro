"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import RealTimeEditor from "./components/CodeEditor";
import { useParams } from "next/navigation";
import api from "@/lib/axios";

export default function Page() {
  const { fileId, projectId } = useParams();
  const { data: session } = useSession();
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.backendJWT || !fileId) return;

    const fetchFileData = async () => {
      try {
        const res = await api.get(`/node/${fileId}`, {
          headers: { Authorization: `Bearer ${session.backendJWT}` },
        });
        setFileData(res.data?.data);
      } catch (error) {
        console.error("Failed to fetch file data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFileData();
  }, [fileId, session?.backendJWT]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <main style={{ padding: 20 }}>
      <RealTimeEditor 
        fileId={fileId} 
        fileName={fileData?.name || 'untitled.js'}
        projectId={projectId}
      />
    </main>
  );
}
