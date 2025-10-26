import SessionWrapper from "./SessionWrapper";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import ThemeProvider from "@/app/ThemeProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
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