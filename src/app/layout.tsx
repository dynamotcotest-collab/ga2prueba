import type { ReactNode } from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clases IA",
  description: "Mantenimiento de coaches",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <html lang="es" className="dark">
        <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 antialiased transition-colors duration-300">
          {children}
        </body>
      </html>
    </ThemeProvider>
  );
}
