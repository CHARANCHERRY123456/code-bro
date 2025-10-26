"use client";
export default function ProjectList({ projects }) {
  if (!projects || projects.length === 0)
    return <div className="text-gray-500 italic">No projects found.</div>;
  return (
    <ul className="space-y-2">
      {projects.map((project) => (
        <li key={project.id} className="bg-white shadow rounded px-4 py-2 flex items-center justify-between">
          <span className="font-medium text-blue-700">{project.name}</span>
        </li>
      ))}
    </ul>
  );
}
