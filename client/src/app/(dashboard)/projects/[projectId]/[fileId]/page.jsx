"use client";
import { useState } from "react";
import RealTimeEditor from "./components/CodeEditor";
import { useParams } from "next/navigation";

export default function Page() {
 const {fileId} = useParams();
 
  return (
    <main style={{ padding: 20 }}>
      <RealTimeEditor fileId={fileId} />
    </main>
  );
}
