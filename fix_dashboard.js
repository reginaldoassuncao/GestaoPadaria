const fs = require('fs');
const content = `"use client";

import { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area 
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
import { collection, onSnapshot, query, limit } from "firebase/firestore";

// Function to generate data (real usage would come from a "transactions" collection)
const getWeeklyData = (hasData: boolean) => [
  { name: 'Seg', valor: hasData ? 4000 : 0 },
  { name: 'Ter', valor: hasData ? 3000 : 0 },
  { name: 'Qua', valor: hasData ? 2000 : 0 },
  { name: 'Qui', valor: hasData ? 2780 : 0 },
  { name: 'Sex', valor: hasData ? 1890 : 0 },
  { name: 'Sáb', valor: hasData ? 2390 : 0 },
  { name: 'Dom', valor: hasData ? 3490 : 0 },
];

const COLORS = ['#846358', '#422a22', '#c7a38e', '#f3e5db'];

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    totalValue: 0,
    categories: [] as { name: string, value: number }[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "ingredients"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let total = 0;
      let low = 0;
      let value = 0;
      const categoryMap: Record<string, number> = {};

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        total++;
        value += (data.quantity || 0) * (data.cost || 0);
        
        if (data.quantity <= (data.minQuantity || 0)) {
          low++;
        }

        categoryMap[data.category] = (categoryMap[data.category] || 0) + 1;
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

  const weeklyData = getWeeklyData(stats.totalItems > 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header section with stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total de Ingredientes" 
          value={loading ? "..." : stats.totalItems.toString()} 
          icon={<Package className="w-6 h-6" />}
          trend={stats.totalItems > 0 ? "+2 novos" : "Aguardando itens"}
          trendUp={true}
        />
        <StatCard 
          title="Itens em Alerta" 
          value={loading ? "..." : stats.lowStock.toString()} 
          icon={<AlertTriangle className="w-6 h-6" />}
          trend={stats.lowStock > 0 ? "Estoque crítico" : "Tudo em ordem"}
          trendUp={false}
          highlight={stats.lowStock > 0}
        />
        <StatCard 
          title="Consumo Semanal" 
          value={stats.totalItems > 0 ? "4.2kg" : "0.0kg"} 
          icon={<TrendingUp className="w-6 h-6" />}
          trend={stats.totalItems > 0 ? "-0.5kg que usual" : "Sem movimentação"}
          trendUp={true}
        />
        <StatCard 
          title="Valor em Estoque" 
          value={loading ? "..." : \`R$ \${stats.totalValue.toFixed(2)}\`} 
          icon={<ShoppingBag className="w-6 h-6" />}
          trend="Patrimônio atual"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-bakery-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-xl text-bakery-900">Movimentação de Estoque</h3>
              <p className="text-sm text-bakery-400 font-medium">Fluxo de saída dos últimos 7 dias</p>
            </div>
            <select className="bg-bakery-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-bakery-700 outline-none">
              <option>Esta Semana</option>
              <option>Mês Passado</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            {stats.totalItems === 0 && !loading ? (
               <div className="h-full w-full flex flex-col items-center justify-center text-bakery-300 space-y-2">
                  <TrendingUp className="w-12 h-12 opacity-20" />
                  <p className="text-sm font-medium">Nenhum dado para exibir ainda</p>
               </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#846358" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#846358" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3e5db" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#c7a38e', fontSize: 12, fontWeight: 600}}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                    labelStyle={{fontWeight: 'bold', color: '#422a22'}}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="valor" 
                    stroke="#846358" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValor)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Side Section: AI Insights & Quick Actions */}
        <div className="space-y-6">
          <div className="bg-bakery-900 p-8 rounded-3xl text-white relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-bakery-200" />
                <span className="text-xs font-bold uppercase tracking-widest text-bakery-200">Insight da IA</span>
              </div>
              <h4 className="font-bold text-lg mb-2">Sugestão do Dia</h4>
              <p className="text-bakery-200/80 text-sm leading-relaxed mb-6 font-serif italic text-base">
                {stats.totalItems === 0 
                  ? "Seu estoque está vazio. Comece adicionando farinha e outros insumos básicos no controle de estoque!"
                  : stats.lowStock > 0 
                  ? "Você tem itens com estoque baixo. Considere utilizar o Assistente Criativo para criar receitas com o que resta!" 
                  : "Seu estoque está saudável. É um ótimo momento para testar uma nova receita de pão artesanal."}
              </p>
              <Link href={stats.totalItems === 0 ? "/estoque" : "/chef"} className="inline-flex items-center gap-2 text-sm font-bold bg-white text-bakery-900 px-6 py-3 rounded-xl hover:bg-bakery-100 transition-colors shadow-xl shadow-bakery-950/20">
                {stats.totalItems === 0 ? "Ir para Estoque" : "Falar com Chef"}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-700" />
            <div className="absolute -bottom-20 -left-10 w-40 h-40 bg-bakery-200/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700" />
          </div>

          <div className="bg-white p-6 rounded-3xl border border-bakery-100 shadow-sm">
            <h4 className="font-bold text-bakery-900 mb-4 flex items-center justify-between">
              Categorias
              <span className="text-[10px] bg-bakery-50 px-2 py-1 rounded-full text-bakery-400">{stats.categories.length} total</span>
            </h4>
            <div className="h-[180px]">
              {stats.totalItems === 0 && !loading ? (
                <div className="h-full w-full flex items-center justify-center opacity-20">
                   <div className="w-24 h-24 rounded-full border-8 border-bakery-200" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.categories.length > 0 ? stats.categories : [{name: 'Sem dados', value: 1}]}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {(stats.categories.length > 0 ? stats.categories : [{name: 'Sem dados', value: 1}]).map((entry, index) => (
                        <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {stats.categories.slice(0, 4).map((cat, idx) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[idx % COLORS.length]}} />
                  <span className="text-[10px] font-bold text-bakery-500 uppercase">{cat.name}</span>
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
    <div className={\`bg-white p-6 rounded-3xl border border-bakery-100 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md \${highlight ? 'ring-2 ring-red-100' : ''}\`}>
      <div className="flex items-center justify-between mb-4">
        <div className={\`p-3 \${highlight ? 'bg-red-50 text-red-600' : 'bg-bakery-50 text-bakery-700'} rounded-2xl\`}>
          {icon}
        </div>
        <div className={\`flex items-center gap-1 text-[10px] font-bold uppercase tracking-tight \${trendUp ? 'text-green-500' : 'text-red-400'}\`}>
          {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <h3 className="text-bakery-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
      <p className="text-2xl font-black text-bakery-900">{value}</p>
    </div>
  );
}
`;
fs.writeFileSync('src/app/page.tsx', content, 'utf8');
console.log('Dashboard fixed to show 0 when inventory is empty');
