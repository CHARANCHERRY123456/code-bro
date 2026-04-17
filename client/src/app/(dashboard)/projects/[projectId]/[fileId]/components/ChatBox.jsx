"use client";

export default function ChatBox() {
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-[#2f3438]">
        <h2 className="text-sm font-semibold text-gray-200">AI Chat</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 text-sm text-gray-400">
        Start a conversation here.
      </div>
    </div>
  );
}