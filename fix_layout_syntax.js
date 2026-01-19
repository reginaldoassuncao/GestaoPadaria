const fs = require('fs');
const content = `"use client";

import { useAuth, AuthProvider } from "@/context/AuthContext";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-bakery-50 text-bakery-500 gap-4 font-sans">
        <Loader2 className="w-10 h-10 animate-spin text-bakery-700" />
        <p className="font-bold tracking-widest uppercase text-sm">Carregando PanificAI...</p>
      </div>
    );
  }

  if (!user && !isLoginPage) return null;

  const wrapperClass = isLoginPage ? "" : "bg-bakery-50";
  const mainClass = isLoginPage ? "" : "ml-64 min-h-screen bg-bakery-50";
  const contentClass = isLoginPage ? "" : "p-8";

  return (
    <div className={"flex " + wrapperClass}>
      {!isLoginPage && <Sidebar />}
      <main className={"flex-1 " + mainClass}>
        {!isLoginPage && (
          <header className="h-16 border-b border-bakery-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-40 transition-all">
            <h2 className="font-bold text-xl text-bakery-900 font-serif">
               Sistema de Gestão
            </h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
              <span className="text-xs text-bakery-500 font-bold uppercase tracking-tighter">Sistema Online</span>
            </div>
          </header>
        )}
        <div className={contentClass}>
          {children}
        </div>
      </main>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={geistSans.variable + " " + geistMono.variable + " antialiased text-foreground bg-white"}>
        <AuthProvider>
          <RootLayoutContent>
            {children}
          </RootLayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}
`;
fs.writeFileSync('src/app/layout.tsx', content, 'utf8');
console.log('Layout fixed successfully');
