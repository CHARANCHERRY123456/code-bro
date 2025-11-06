"use client";
import { useParams } from "next/navigation";
import ProjectFiles from "./components/ProjectFiles";

export default function ProjectPage() {
  const { projectId } = useParams();
  return (
    <div className="p-6 ">
      <h2 className="text-xl font-semibold mb-4">Project ID: {projectId}</h2>
      <div className="">
        <ProjectFiles projectId={projectId} />
      </div>
    </div>
  );
}