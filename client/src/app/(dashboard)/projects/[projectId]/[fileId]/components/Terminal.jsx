'use client';

export default function Terminal({ projectId, fileId }) {
  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border-t border-[#2f3438]">
      {/* Terminal Header */}
      <div className="px-3 py-2 bg-[#1f2426] border-b border-[#2f3438] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm font-medium text-gray-300">Terminal</span>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 overflow-auto p-4 font-mono text-sm text-gray-300">
        <p className="text-gray-500">Terminal placeholder - Coming soon...</p>
      </div>
    </div>
  );
}
