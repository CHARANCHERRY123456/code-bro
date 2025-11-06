import SessionWrapper from "./SessionWrapper";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import ThemeProvider from "@/app/ThemeProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Inject Tailwind CDN in development only as a debug fallback so utilities render while we troubleshoot PostCSS */}
      <head>
        {process.env.NODE_ENV !== 'production' && (
          <script src="https://cdn.tailwindcss.com"></script>
        )}
      </head>
      <body className="bg-white text-gray-900 antialiased dark:bg-slate-900 dark:text-gray-100">
        <ThemeProvider>
          <SessionWrapper>
            <Navbar />
            {children}
          </SessionWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}