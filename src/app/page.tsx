"use client";

import { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, 
  AlertTriangle, 
  ShoppingBag, 
  Package, 
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import Link from 'next/link';
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

const emptyWeeklyData = [
  { name: 'Seg', valor: 0 },
  { name: 'Ter', valor: 0 },
  { name: 'Qua', valor: 0 },
  { name: 'Qui', valor: 0 },
  { name: 'Sex', valor: 0 },
  { name: 'Sáb', valor: 0 },
  { name: 'Dom', valor: 0 },
];

const COLORS = ['#846358', '#422a22', '#c7a38e', '#f3e5db', '#d9c5b2'];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    totalValue: 0,
    categories: [] as { name: string, value: number }[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "ingredients"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let total = 0;
      let low = 0;
      let value = 0;
      const categoryMap: Record<string, number> = {};

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        total++;
        value += (Number(data.quantity) || 0) * (Number(data.cost) || 0);
        
        if (Number(data.quantity) <= (Number(data.minQuantity) || 0)) {
          low++;
        }

        const cat = data.category || "Outros";
        categoryMap[cat] = (categoryMap[cat] || 0) + 1;
      });

      const categories = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
      
      setStats({
        totalItems: total,
        lowStock: low,
        totalValue: value,
        categories
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-bakery-900 tracking-tight">
            Olá, {user?.displayName?.split(' ')[0] || 'Chef'}! 👋
          </h2>
          <p className="text-bakery-400 font-medium">Veja como está a sua padaria hoje.</p>
        </div>
        <div className="flex items-center gap-2 bg-bakery-100/50 px-4 py-2 rounded-2xl border border-bakery-100">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-bold text-bakery-700 uppercase tracking-wider">Sistema Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total de Ingredientes" 
          value={loading ? "..." : stats.totalItems.toString()} 
          icon={<Package className="w-6 h-6" />}
          trend={stats.totalItems > 0 ? "Itens cadastrados" : "Nenhum item"}
          trendUp={stats.totalItems > 0}
        />
        <StatCard 
          title="Itens em Alerta" 
          value={loading ? "..." : stats.lowStock.toString()} 
          icon={<AlertTriangle className="w-6 h-6" />}
          trend={stats.lowStock > 0 ? "Reposição necessária" : "Estoque em dia"}
          trendUp={false}
          highlight={stats.lowStock > 0}
        />
        <StatCard 
          title="Consumo Semanal" 
          value="0.0kg" 
          icon={<TrendingUp className="w-6 h-6" />}
          trend="Aguardando dados"
          trendUp={true}
        />
        <StatCard 
          title="Valor em Estoque" 
          value={loading ? "..." : `R$ ${stats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          icon={<ShoppingBag className="w-6 h-6" />}
          trend="Total investido"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-bakery-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-xl text-bakery-900">Movimentação de Estoque</h3>
              <p className="text-sm text-bakery-400 font-medium">Fluxo de saída calculado por vendas</p>
            </div>
            <div className="bg-bakery-50 px-4 py-2 rounded-xl text-xs font-bold text-bakery-400">
              EM BREVE
            </div>
          </div>
          <div className="h-[300px] w-full relative">
            {/* Visual placeholder for empty state */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-bakery-200 z-10">
               <TrendingUp className="w-12 h-12 opacity-10 mb-2" />
               <p className="text-xs font-bold tracking-widest uppercase opacity-40">Sem movimentação registrada</p>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={emptyWeeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fdf8f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#c7a38e', fontSize: 10, fontWeight: 600}}
                  dy={10}
                />
                <Area 
                  type="monotone" 
                  dataKey="valor" 
                  stroke="#f3e5db" 
                  fill="#fdf8f6" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-bakery-900 p-8 rounded-3xl text-white relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-bakery-200" />
                <span className="text-xs font-bold uppercase tracking-widest text-bakery-200">Insight da IA</span>
              </div>
              <h4 className="font-bold text-lg mb-2">Sugestão do Chef</h4>
              <p className="text-bakery-200/80 text-sm leading-relaxed mb-6 font-serif italic text-base">
                {stats.totalItems === 0 
                  ? "Sua vitrine está vazia. Comece cadastrando seus ingredientes para que eu possa sugerir receitas incríveis!"
                  : stats.lowStock > 0 
                  ? "Atenção ao estoque! Alguns itens fundamentais estão acabando. Use o Assistente para aproveitar o que ainda resta." 
                  : "Estoque balanceado! Que tal usar um pouco dessa criatividade para criar um novo carro-chefe hoje?"}
              </p>
              <Link href={stats.totalItems === 0 ? "/estoque" : "/chef"} className="inline-flex items-center gap-2 text-sm font-bold bg-white text-bakery-900 px-6 py-3 rounded-xl hover:bg-bakery-100 transition-colors shadow-xl">
                {stats.totalItems === 0 ? "Abastecer Estoque" : "Explorar Receitas"}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-700" />
          </div>

          <div className="bg-white p-6 rounded-3xl border border-bakery-100 shadow-sm">
            <h4 className="font-bold text-bakery-900 mb-4 flex items-center justify-between font-serif">
              Mix de Produtos
              <span className="text-[10px] bg-bakery-50 px-2 py-1 rounded-full text-bakery-400 font-sans tracking-tight">{stats.categories.length} CATEGORIAS</span>
            </h4>
            <div className="h-[180px]">
              {stats.totalItems === 0 ? (
                <div className="h-full w-full flex items-center justify-center">
                   <div className="w-24 h-24 rounded-full border-4 border-dashed border-bakery-50" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.categories}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {stats.categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-y-2">
              {stats.categories.slice(0, 4).map((cat, idx) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: COLORS[idx % COLORS.length]}} />
                  <span className="text-[9px] font-bold text-bakery-400 uppercase truncate">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, trendUp, highlight = false }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendUp?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className={`bg-white p-6 rounded-3xl border border-bakery-100 shadow-sm transition-all hover:translate-y-[-2px] ${highlight ? 'ring-2 ring-red-100' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${highlight ? 'bg-red-50 text-red-600' : 'bg-bakery-50 text-bakery-700'} rounded-2xl`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-tight ${trendUp ? 'text-green-500' : 'text-bakery-300'}`}>
          {trendUp ? <ArrowUpRight className="w-3 h-3" /> : null}
          {trend}
        </div>
      </div>
      <h3 className="text-bakery-400 text-[10px] font-bold uppercase tracking-widest mb-1">{title}</h3>
      <p className="text-2xl font-black text-bakery-900">{value}</p>
    </div>
  );
}
