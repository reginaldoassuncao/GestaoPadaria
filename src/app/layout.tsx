"use client";

import { useAuth, AuthProvider } from "@/context/AuthContext";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { Loader2, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isLoginPage = pathname === "/login";

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-bakery-50 text-bakery-500 gap-4 font-sans">
        <Loader2 className="w-10 h-10 animate-spin text-bakery-700" />
        <p className="font-bold tracking-widest uppercase text-sm">Carregando PanificAI...</p>
      </div>
    );
  }

  if (!user && !isLoginPage) return null;

  return (
    <div className={`flex min-h-screen ${isLoginPage ? "" : "bg-bakery-50/30"}`}>
      {!isLoginPage && (
        <>
          {/* Overlay mobile */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-bakery-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          <Sidebar isOpen={isSidebarOpen} />
        </>
      )}
      
      <main className={`flex-1 flex flex-col ${isLoginPage ? "" : "lg:ml-64 w-full"}`}>
        {!isLoginPage && (
          <header className="h-16 border-b border-bakery-100 flex items-center justify-between px-4 md:px-8 bg-white/80 backdrop-blur-md sticky top-0 z-30 transition-all">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-bakery-50 rounded-xl text-bakery-700 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="font-bold text-lg md:text-xl text-bakery-900 font-serif truncate">
                Sistema de Gestão
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
              <span className="hidden sm:inline text-xs text-bakery-500 font-bold uppercase tracking-tighter">Sistema Online</span>
            </div>
          </header>
        )}
        <div className={`flex-1 ${isLoginPage ? "" : "p-4 md:p-8"}`}>
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
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-foreground bg-white`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <RootLayoutContent>
            {children}
          </RootLayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}
