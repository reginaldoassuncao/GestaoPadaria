"use client";

import { useState } from "react";
import { 
  browserLocalPersistence,
  setPersistence,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { ChefHat, Loader2, AlertCircle } from "lucide-react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await setPersistence(auth, browserLocalPersistence);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err: any) {
      console.error("Erro no login:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError("O login foi cancelado.");
      } else {
        setError("Ocorreu um erro ao tentar entrar com o Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bakery-50 p-4 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/wood-pattern-with-holes.png')]">
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-bakery-200/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-bakery-900/5 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-bakery-100/50 backdrop-blur-sm">
          <div className="p-10 pt-14 text-center bg-bakery-900 text-white relative">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/pantry.png')]" />
            <div className="bg-white/10 p-5 rounded-full w-24 h-24 mx-auto mb-6 backdrop-blur-md border border-white/20 flex items-center justify-center relative shadow-inner">
              <ChefHat className="w-12 h-12 text-bakery-50" />
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2 font-serif">PanificAI</h1>
            <p className="text-bakery-200 text-xs font-bold uppercase tracking-[0.3em]">Gestão Inteligente</p>
          </div>

          <div className="p-12 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-bakery-900">Acesso Restrito</h2>
              <p className="text-sm text-bakery-400 font-medium leading-relaxed max-w-[240px] mx-auto">
                Utilize sua conta do Google para acessar o painel de controle.
              </p>
            </div>

            <div className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="font-bold">{error}</p>
                </div>
              )}

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white hover:bg-bakery-50 text-bakery-900 py-5 rounded-[1.5rem] font-black text-base border-2 border-bakery-100 transition-all active:scale-[0.98] flex items-center justify-center gap-4 shadow-xl shadow-bakery-900/5 group"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-bakery-700" />
                ) : (
                  <>
                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>Entrar com o Google</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-4 text-center">
              <p className="text-[10px] text-bakery-300 font-bold uppercase tracking-widest max-w-[200px] mx-auto leading-loose">
                Acesso exclusivo para administradores da padaria.
              </p>
            </div>
          </div>
          
          <div className="bg-bakery-50/50 p-6 border-t border-bakery-50 text-center">
            <p className="text-[10px] text-bakery-300 font-black uppercase tracking-[0.2em]">
              PanificAI SafeLog • Autenticação Segura
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
