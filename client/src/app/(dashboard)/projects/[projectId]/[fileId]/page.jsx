"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import RealTimeEditor from "./components/CodeEditor";
import Terminal from "./components/Terminal";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { preloadPyodide } from '@/lib/runRuntimes';

export default function Page() {
  const { fileId, projectId } = useParams();
  const { data: session } = useSession();
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [terminalHeight, setTerminalHeight] = useState(300); // Default terminal height
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const terminalRef = useRef(null);
  const [currentCode, setCurrentCode] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('javascript');

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

  // Preload Pyodide in background to reduce Python first-run latency
  useEffect(() => {
    // fire-and-forget
    preloadPyodide().catch(() => {});
  }, []);

  // Handle terminal resize
  const handleMouseDown = () => {
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || !containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const newHeight = containerRect.bottom - e.clientY;
      
      // Min height 150px, max 80% of container
      const minHeight = 150;
      const maxHeight = containerRect.height * 0.8;
      
      if (newHeight >= minHeight && newHeight <= maxHeight) {
        setTerminalHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <main 
      ref={containerRef}
      className="h-full flex flex-col overflow-hidden"
      style={{ userSelect: isResizing ? 'none' : 'auto' }}
    >
      {/* Editor Section */}
      <div 
        className="flex-1 overflow-hidden"
        style={{ height: `calc(100% - ${terminalHeight}px)` }}
      >
        <RealTimeEditor 
          ref={editorRef}
          fileId={fileId} 
          fileName={fileData?.name || 'untitled.js'}
          projectId={projectId}
          onCodeChange={setCurrentCode}
          onLanguageChange={setCurrentLanguage}
        />
      </div>

      {/* Resizer */}
      <div
        onMouseDown={handleMouseDown}
        className="h-1 bg-[#2f3438] hover:bg-blue-500 cursor-row-resize transition-colors relative group"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-1 bg-[#3e3e42] rounded-full group-hover:bg-blue-500 transition-colors"></div>
        </div>
      </div>

      {/* Terminal Section */}
      <div 
        className="overflow-hidden bg-[#1e1e1e]"
        style={{ height: `${terminalHeight}px` }}
      >
        <Terminal 
          ref={terminalRef}
          code={currentCode}
          language={currentLanguage}
          fileName={fileData?.name || 'untitled.js'}
        />
      </div>
    </main>
  );
}
