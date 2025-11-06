"use client";
import { useRouter } from "next/navigation";
import { Folder, Users } from "lucide-react"; // lucide-react for clean mac icons

export default function ProjectList({ projects }) {
  const router = useRouter();

  if (!projects || projects.length === 0)
    return (
      <div className="text-[gray] italic p-6 bg-white/70 dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-700 text-center shadow-inner">
        No projects found.
      </div>
    );

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
  <div className="project-list-fallback grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => router.push(`/projects/${project.id}`)}
            className="group cursor-pointer relative select-none bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 p-5 rounded-2xl"
          >
            {/* Folder Icon */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-all">
                  <Folder size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {project.name}
                  </h3>
                  {project.role && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      Role: {project.role}
                    </div>
                  )}
                </div>
              </div>
              <div className="ml-2 text-sm text-gray-400 dark:text-gray-500">
                #{project.id}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Users size={16} className="mr-1.5" /> Created by you
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/projects/${project.id}`);
                  }}
                  className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Open
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  Members
                </button>
              </div>
            </div>

            {/* Subtle overlay when hovered */}
            <div className="absolute inset-0 rounded-2xl bg-blue-100/10 dark:bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
