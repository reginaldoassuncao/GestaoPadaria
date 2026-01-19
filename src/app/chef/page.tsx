"use client";

import { useState, useEffect } from "react";
import { ChefHat, Sparkles, Loader2, Clock, Utensils, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, where, QuerySnapshot, DocumentData } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

interface Ingredient {
  id: string;
  name: string;
  category: string;
}

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
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingIngredients, setLoadingIngredients] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "ingredients"), 
      where("userId", "==", user.uid),
      orderBy("name", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        category: doc.data().category
      })) as Ingredient[];
      
      setIngredients(items);
      setLoadingIngredients(false);
    });

    return () => unsubscribe();
  }, [user]);

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

  // Group ingredients by category
  const categories = ingredients.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-bakery-900">Assistente Criativo</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Ingredient Selection */}
        <div className="bg-white p-6 rounded-2xl border border-bakery-100 shadow-sm space-y-6 lg:sticky lg:top-24">
          <div className="flex items-center gap-2 mb-4">
            <ChefHat className="w-6 h-6 text-bakery-700" />
            <h2 className="font-bold text-lg text-bakery-900">Chef IA</h2>
          </div>
          <p className="text-xs text-bakery-500 mb-6 italic">
            Selecione ingredientes do seu estoque para criar receitas criativas.
          </p>

          <div className="space-y-6">
            {loadingIngredients ? (
              <div className="flex flex-col items-center py-10 text-bakery-400">
                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                <span className="text-xs">Carregando estoque...</span>
              </div>
            ) : Object.keys(categories).length === 0 ? (
              <p className="text-xs text-center text-bakery-400 py-10 italic">
                Nenhum ingrediente no estoque. Adicione-os na página de Estoque primeiro.
              </p>
            ) : (
              Object.entries(categories).map(([category, items]) => (
                <div key={category} className="space-y-2">
                  <h3 className="text-xs font-bold text-bakery-400 uppercase tracking-widest">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map(item => (
                      <button
                        key={item}
                        onClick={() => toggleIngredient(item)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-[11px] transition-all border",
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
              ))
            )}
          </div>

          <button
            onClick={generateRecipe}
            disabled={loading || selectedIngredients.length === 0}
            className="w-full bg-bakery-700 hover:bg-bakery-800 disabled:bg-bakery-200 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all mt-8 shadow-lg shadow-bakery-100"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Criando Receita...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Gerar Nova Receita</span>
              </>
            )}
          </button>
        </div>

        {/* Recipe Display */}
        <div className="lg:col-span-2 space-y-6">
          {!recipe && !loading && (
            <div className="bg-bakery-50/50 border-2 border-dashed border-bakery-100 rounded-3xl p-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 bg-white rounded-full shadow-sm">
                <ChefHat className="w-12 h-12 text-bakery-200" />
              </div>
              <div className="max-w-xs">
                <h3 className="text-bakery-900 font-bold text-lg">Pronto para criar?</h3>
                <p className="text-bakery-500 text-sm">Escolha os ingredientes e deixe a IA formular uma receita exclusiva para sua padaria.</p>
              </div>
            </div>
          )}

          {recipe && (
            <div className="bg-white rounded-2xl border border-bakery-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-8 bg-bakery-900 text-white relative overflow-hidden">
                <Sparkles className="absolute top-4 right-4 text-bakery-300 w-8 h-8 opacity-20" />
                <h2 className="text-3xl font-bold mb-2">{recipe.title}</h2>
                <p className="text-bakery-200 leading-relaxed font-serif italic text-lg">{recipe.description}</p>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-bakery-50 rounded-xl flex flex-col items-center text-center">
                    <Clock className="w-5 h-5 text-bakery-700 mb-1" />
                    <span className="text-[10px] text-bakery-400 font-bold uppercase">Tempo</span>
                    <span className="font-bold text-bakery-900 text-sm">{recipe.preparationTime}</span>
                  </div>
                  <div className="p-4 bg-bakery-50 rounded-xl flex flex-col items-center text-center">
                    <Utensils className="w-5 h-5 text-bakery-700 mb-1" />
                    <span className="text-[10px] text-bakery-400 font-bold uppercase">Dificuldade</span>
                    <span className="font-bold text-bakery-900 text-sm">{recipe.difficulty}</span>
                  </div>
                  <div className="p-4 bg-bakery-50 rounded-xl flex flex-col items-center text-center">
                    <DollarSign className="w-5 h-5 text-bakery-700 mb-1" />
                    <span className="text-[10px] text-bakery-400 font-bold uppercase">Custo Est.</span>
                    <span className="font-bold text-bakery-900 text-sm">{recipe.estimatedCost}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-bakery-50 pb-2">
                      <div className="w-1.5 h-6 bg-bakery-700 rounded-full" />
                      <h3 className="font-bold text-bakery-900">Ingredientes</h3>
                    </div>
                    <ul className="space-y-2">
                      {recipe.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-bakery-700">
                          <span className="w-1.5 h-1.5 bg-bakery-200 rounded-full mt-2 shrink-0" />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-bakery-50 pb-2">
                      <div className="w-1.5 h-6 bg-bakery-700 rounded-full" />
                      <h3 className="font-bold text-bakery-900">Modo de Preparo</h3>
                    </div>
                    <ol className="space-y-4">
                      {recipe.steps.map((step, i) => (
                        <li key={i} className="flex gap-4">
                          <span className="font-black text-bakery-100 text-3xl leading-none">{i + 1}</span>
                          <span className="text-sm text-bakery-700 leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
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
