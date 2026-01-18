"use client";

import { useState } from "react";
import { Search, Plus, Trash2, Minus, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const INITIAL_INGREDIENTS = [
  { id: 1, name: "Farinha de Trigo", category: "Farinhas", quantity: 50, unit: "kg", cost: 4.50, lowStock: false },
  { id: 2, name: "Açúcar Refinado", category: "Outros", quantity: 20, unit: "kg", cost: 3.20, lowStock: false },
  { id: 3, name: "Ovos", category: "Laticínios", quantity: 120, unit: "un", cost: 0.50, lowStock: false },
  { id: 4, name: "Chocolate em Pó", category: "Outros", quantity: 2, unit: "kg", cost: 25.00, lowStock: true },
  { id: 5, name: "Leite Integral", category: "Laticínios", quantity: 5, unit: "L", cost: 4.80, lowStock: true },
  { id: 6, name: "Bananas Maduras", category: "Frutas", quantity: 15, unit: "kg", cost: 2.00, lowStock: false },
  { id: 7, name: "Fermento Biológico", category: "Outros", quantity: 1, unit: "kg", cost: 15.00, lowStock: true },
];

export default function Estoque() {
  const [ingredients, setIngredients] = useState(INITIAL_INGREDIENTS);
  const [search, setSearch] = useState("");

  const filteredIngredients = ingredients.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const updateQuantity = (id: number, delta: number) => {
    setIngredients(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
    ));
  };

  const removeIngredient = (id: number) => {
    setIngredients(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-bakery-900">Controle de Estoque</h1>
        <button className="bg-bakery-700 hover:bg-bakery-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium">
          <Plus className="w-5 h-5" />
          Novo Ingrediente
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-bakery-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-bakery-50 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-bakery-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar ingredientes..." 
              className="w-full bg-bakery-50 border-none rounded-lg py-2 pl-10 pr-4 text-bakery-900 placeholder:text-bakery-400 focus:ring-2 focus:ring-bakery-200 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bakery-50/50">
              <th className="px-6 py-4 font-bold text-bakery-700 text-sm">Ingrediente</th>
              <th className="px-6 py-4 font-bold text-bakery-700 text-sm">Categoria</th>
              <th className="px-6 py-4 font-bold text-bakery-700 text-sm">Quantidade</th>
              <th className="px-6 py-4 font-bold text-bakery-700 text-sm text-right">Custo Unit.</th>
              <th className="px-6 py-4 font-bold text-bakery-700 text-sm text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bakery-50">
            {filteredIngredients.map((item) => (
              <tr key={item.id} className="hover:bg-bakery-50/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-bakery-900">{item.name}</span>
                    {item.lowStock && (
                      <span className="text-[10px] text-red-500 flex items-center gap-1 mt-1 font-medium">
                        <AlertCircle className="w-3 h-3" /> Estoque baixo
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    item.category === "Farinhas" ? "bg-bakery-100 text-bakery-700" :
                    item.category === "Laticínios" ? "bg-orange-50 text-orange-700" :
                    item.category === "Frutas" ? "bg-green-50 text-green-700" :
                    "bg-gray-100 text-gray-700"
                  )}>
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 hover:bg-bakery-100 rounded text-bakery-400 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-mono font-medium text-bakery-900 w-12 text-center">
                      {item.quantity}{item.unit}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 hover:bg-bakery-100 rounded text-bakery-400 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-medium text-bakery-900">
                  R$ {item.cost.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => removeIngredient(item.id)}
                    className="p-2 hover:bg-red-50 text-red-400 hover:text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
