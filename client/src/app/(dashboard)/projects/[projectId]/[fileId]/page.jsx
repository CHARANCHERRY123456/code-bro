"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import CodeEditor from "./components/CodeEditor";

export default function Editor() {
    const { fileId } = useParams();
    const { data: session } = useSession();
    const [content, setContent] = useState("");
    const [fileName, setFileName] = useState("");

    useEffect(() => {
        if (!session?.backendJWT) return;

        async function fetchFileContent() {
            try {
                const response = await api.get(`/node/${fileId}`, {
                    headers: { Authorization: `Bearer ${session.backendJWT}` }
                });
                setFileName(response.data?.data?.name || "File");
                setContent(response.data?.data?.content || "");
            } catch (error) {
                console.error("Error fetching file content:", error.message);
            }
        }
        fetchFileContent();
    }, [fileId, session?.backendJWT]);

    return (
        <div className="flex flex-col h-full p-4">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">{fileName}</h2>
            <CodeEditor
                value={content}
                setValue={setContent}
                className="flex-1 p-4 bg-white dark:bg-slate-800 dark:text-white border rounded font-mono text-sm resize-none"
                placeholder="File content..."
            />
        </div>
    );
}