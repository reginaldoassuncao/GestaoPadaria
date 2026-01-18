"use client";

import { AlertTriangle, DollarSign, Package, PieChart, Sparkles } from "lucide-react";
import StatCard from "@/components/StatCard";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart as RePieChart,
  Pie
} from "recharts";

const barData = [
  { name: "Farinha de Trigo", value: 230 },
  { name: "Açúcar Refinado", value: 65 },
  { name: "Ovos", value: 60 },
  { name: "Chocolate em Pó", value: 50 },
  { name: "Leite Integral", value: 38 },
];

const pieData = [
  { name: "Farinhas", value: 40, color: "#846358" },
  { name: "Laticínios", value: 30, color: "#bfa094" },
  { name: "Frutas", value: 15, color: "#d2bab0" },
  { name: "Outros", value: 15, color: "#eaddd7" },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-bakery-900">Visão Geral</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Estoque Baixo" 
          value="3 itens" 
          icon={AlertTriangle} 
          iconBg="bg-red-50" 
          iconColor="text-red-500" 
        />
        <StatCard 
          label="Valor em Estoque" 
          value="R$ 474.90" 
          icon={DollarSign} 
          iconBg="bg-green-50" 
          iconColor="text-green-500" 
        />
        <StatCard 
          label="Total Itens" 
          value="7" 
          icon={Package} 
          iconBg="bg-blue-50" 
          iconColor="text-blue-500" 
        />
        <StatCard 
          label="Categorias" 
          value="4" 
          icon={PieChart} 
          iconBg="bg-purple-50" 
          iconColor="text-purple-500" 
        />
      </div>

      <div className="bg-bakery-900 text-bakery-50 p-6 rounded-2xl flex items-start gap-4 shadow-lg border-2 border-bakery-800">
        <div className="bg-bakery-800 p-2 rounded-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="space-y-2">
          <h3 className="font-bold text-lg">Insight do Gerente IA</h3>
          <p className="text-bakery-200 text-sm leading-relaxed">
            Priorize a produção imediata de bolos, pães ou doces de banana para evitar a perda dos 15kg de frutas maduras. 
            Aproveite o estoque abundante de farinha, açúcar e ovos para maximizar essa fornada e garantir a venda.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-bakery-100 shadow-sm">
          <h3 className="font-bold text-bakery-900 mb-6">Valor por Ingrediente (Top 5)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: "#a18072", fontSize: 11}}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: "#a18072", fontSize: 11}}
                />
                <Tooltip 
                  cursor={{fill: "#fdf8f6"}}
                  contentStyle={{borderRadius: "12px", border: "1px solid #eaddd7"}}
                />
                <Bar dataKey="value" fill="#846358" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-bakery-100 shadow-sm">
          <h3 className="font-bold text-bakery-900 mb-6">Distribuição por Categoria</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
