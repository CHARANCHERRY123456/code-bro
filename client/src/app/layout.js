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
      <body>
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