"use client";
export default function ProjectList({ projects }) {
  if (!projects || projects.length === 0)
    return (
      <div className="text-gray-500 italic p-4 bg-white/50 rounded">No projects found.</div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition p-4 rounded-lg border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{project.name}</h3>
              {project.role && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Role: {project.role}</div>
              )}
            </div>
            <div className="ml-2 text-sm text-gray-400">#{project.id}</div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-300">Created by you</div>
            <div className="flex items-center gap-2">
              <button className="text-sm px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Open</button>
              <button className="text-sm px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300">Members</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
