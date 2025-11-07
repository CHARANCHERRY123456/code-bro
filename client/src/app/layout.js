import SessionWrapper from "./SessionWrapper";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import ThemeProvider from "@/app/ThemeProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
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