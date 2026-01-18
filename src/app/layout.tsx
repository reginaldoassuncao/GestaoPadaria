import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PanificAI - Gestão Inteligente de Padaria",
  description: "Sistema de gestão inteligente para padarias com auxílio de IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex bg-background text-foreground`}
      >
        <Sidebar />
        <main className="flex-1 ml-64 min-h-screen">
          <header className="h-16 border-b border-bakery-100 flex items-center justify-between px-8 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
            <h2 className="font-bold text-xl text-bakery-900">
               {/* This will be updated by page title */}
               Sistema de Gestão
            </h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-bakery-500 font-medium">Sistema Online</span>
            </div>
          </header>
          <div className="p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
