"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const init = saved === "dark" ? true : saved === "light" ? false : prefersDark;
    setDark(!!init);
    document.documentElement.classList.toggle("dark", !!init);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="p-6 rounded-lg shadow text-center">
        <h1 className="mb-4 text-lg font-semibold">Theme</h1>
        <button onClick={toggle} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-sm">
          {dark ? "Switch to light" : "Switch to dark"}
        </button>
      </div>
    </div>
  );
}