"use client";

import { useState } from "react";
import { ChefHat, Sparkles, Loader2, Clock, Utensils, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { name: "Farinhas", items: ["Farinha de Trigo"] },
  { name: "Outros", items: ["Açúcar Refinado", "Chocolate em Pó", "Fermento Biológico"] },
  { name: "Laticínios", items: ["Ovos", "Leite Integral"] },
  { name: "Frutas", items: ["Bananas Maduras"] },
];

interface Recipe {
  title: string;
  description: string;
  difficulty: string;
  ingredients: string[];
  steps: string[];
  estimatedCost: string;
  preparationTime: string;
}

export default function ChefIA() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleIngredient = (name: string) => {
    setSelectedIngredients(prev =>
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  const generateRecipe = async () => {
    if (selectedIngredients.length === 0) return;
    
    setLoading(true);
    setRecipe(null);
    try {
      const res = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: selectedIngredients }),
      });
      const data = await res.json();
      setRecipe(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-bakery-900">Assistente Criativo</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Ingredient Selection */}
        <div className="bg-white p-6 rounded-2xl border border-bakery-100 shadow-sm space-y-6 sticky top-24">
          <div className="flex items-center gap-2 mb-4">
            <ChefHat className="w-6 h-6 text-bakery-700" />
            <h2 className="font-bold text-lg text-bakery-900">Chef IA</h2>
          </div>
          <p className="text-xs text-bakery-500 mb-6 italic">
            Selecione ingredientes próximos da validade ou em excesso para criar receitas criativas.
          </p>

          <div className="space-y-6">
            {CATEGORIES.map(cat => (
              <div key={cat.name} className="space-y-2">
                <h3 className="text-xs font-bold text-bakery-400 uppercase tracking-widest">{cat.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map(item => (
                    <button
                      key={item}
                      onClick={() => toggleIngredient(item)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs transition-all border",
                        selectedIngredients.includes(item)
                          ? "bg-bakery-700 border-bakery-700 text-white shadow-md shadow-bakery-200"
                          : "bg-white border-bakery-100 text-bakery-500 hover:border-bakery-300"
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={generateRecipe}
            disabled={loading || selectedIngredients.length === 0}
            className="w-full bg-bakery-700 hover:bg-bakery-800 disabled:bg-bakery-200 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all mt-8"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            Gerar Receita
          </button>
        </div>

        {/* Recipe Display */}
        <div className="lg:col-span-2 min-h-[400px] flex flex-col">
          {!recipe && !loading ? (
            <div className="flex-1 bg-bakery-50/50 rounded-2xl border-2 border-dashed border-bakery-100 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                <ChefHat className="w-8 h-8 text-bakery-200" />
              </div>
              <h3 className="text-xl font-bold text-bakery-800">Aguardando Ingredientes</h3>
              <p className="text-bakery-400 max-w-xs mt-2">
                Selecione os ingredientes no painel à esquerda e clique em "Gerar Receita" para ver a mágica da IA acontecer.
              </p>
            </div>
          ) : loading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-pulse">
              <Sparkles className="w-12 h-12 text-bakery-300 mb-4 animate-bounce" />
              <h3 className="text-xl font-bold text-bakery-400">Criando algo delicioso...</h3>
            </div>
          ) : recipe && (
            <div className="bg-white p-8 rounded-2xl border border-bakery-100 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-4">
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {recipe.difficulty}
                </span>
                <h2 className="text-3xl font-black text-bakery-900 leading-tight">
                  {recipe.title}
                </h2>
                <p className="text-bakery-500 italic leading-relaxed text-lg">
                  "{recipe.description}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-bakery-900 border-b border-bakery-50 pb-2">
                    <Utensils className="w-5 h-5 text-bakery-700" />
                    <h3 className="font-bold">Ingredientes</h3>
                  </div>
                  <ul className="space-y-3">
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i} className="flex gap-3 text-bakery-600 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-bakery-300 mt-1.5 flex-shrink-0" />
                        {ing}
                      </li>
                    ))}
                  </ul>

                  <div className="bg-bakery-50/50 p-4 rounded-xl border border-bakery-100 flex items-center justify-between">
                     <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-bakery-400">Custo Estimado</span>
                        <span className="font-bold text-bakery-900 flex items-center gap-1">
                           <DollarSign className="w-4 h-4" /> {recipe.estimatedCost}
                        </span>
                     </div>
                     <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase font-bold text-bakery-400 text-right">Preparo</span>
                        <span className="font-bold text-bakery-900 flex items-center gap-1">
                           <Clock className="w-4 h-4" /> {recipe.preparationTime}
                        </span>
                     </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-bakery-900 border-b border-bakery-50 pb-2">
                    <Clock className="w-5 h-5 text-bakery-700" />
                    <h3 className="font-bold">Modo de Preparo</h3>
                  </div>
                  <div className="space-y-6">
                    {recipe.steps.map((step, i) => (
                      <div key={i} className="flex gap-4">
                        <span className="w-6 h-6 rounded-full bg-bakery-100 text-bakery-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-sm text-bakery-600 leading-relaxed">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
