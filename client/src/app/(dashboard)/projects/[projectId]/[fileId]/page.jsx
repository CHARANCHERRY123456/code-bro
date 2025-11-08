"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { githubDark } from "@uiw/codemirror-theme-github";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { yCollab } from "y-codemirror.next";

export default function Editor() {
  const { fileId } = useParams();
  const { data: session } = useSession();
  const [fileName, setFileName] = useState("");
  const [extensions, setExtensions] = useState([javascript()]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!session?.backendJWT || !fileId) return;

    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      "ws://localhost:5000",
      `file-${fileId}`,
      ydoc
    );
    const ytext = ydoc.getText("codemirror");

    // Wait for provider to sync before loading content
    provider.on('sync', (isSynced) => {
      if (isSynced) {
        // Fetch file content from backend
        api.get(`/node/${fileId}`, {
          headers: { Authorization: `Bearer ${session.backendJWT}` },
        })
        .then((response) => {
          setFileName(response.data?.data?.name || "File");
          const fileContent = response.data?.data?.content || "";
          
          // Only set content if Yjs document is empty
          if (ytext.length === 0 && fileContent) {
            ytext.insert(0, fileContent);
          }
          
          // Setup collaborative editing extension
          setExtensions([
            javascript(),
            yCollab(ytext, provider.awareness)
          ]);
          setIsReady(true);
        })
        .catch((error) => {
          console.error("Error fetching file:", error.message);
          setIsReady(true);
        });
      }
    });

    return () => {
      provider.destroy();
      ydoc.destroy();
    };
  }, [fileId, session?.backendJWT]);

  return (
    <div className="flex flex-col h-full p-4">
      <h2 className="text-lg font-semibold mb-4 dark:text-white">{fileName || "Loading..."}</h2>
      
      {isReady ? (
        <CodeMirror
          height="100%"
          theme={githubDark}
          extensions={extensions}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightActiveLine: true,
            foldGutter: true,
          }}
          style={{ fontSize: "14px", minHeight: "calc(1.5em * 10)" }}
        />
      ) : (
        <div className="text-gray-500">Connecting to editor...</div>
      )}
    </div>
  );
}
