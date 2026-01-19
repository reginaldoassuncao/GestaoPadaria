"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Trash2, Minus, AlertCircle, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  where,
  QuerySnapshot,
  DocumentData
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

interface Ingredient {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  cost: number;
  minQuantity?: number;
}

export default function Estoque() {
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Farinhas");
  const [newQuantity, setNewQuantity] = useState<string>("");
  const [newUnit, setNewUnit] = useState("kg");
  const [newCost, setNewCost] = useState<string>("");
  const [newMinQuantity, setNewMinQuantity] = useState<string>("5");

  const ingredientsRef = collection(db, "ingredients");

  useEffect(() => {
    if (!user) return;

    const q = query(
      ingredientsRef, 
      where("userId", "==", user.uid),
      orderBy("name", "asc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Ingredient[];
      
      setIngredients(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredIngredients = ingredients.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !user) return;

    try {
      await addDoc(ingredientsRef, {
        userId: user.uid,
        name: newName,
        category: newCategory,
        quantity: Number(newQuantity),
        unit: newUnit,
        cost: Number(newCost),
        minQuantity: Number(newMinQuantity)
      });
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const resetForm = () => {
    setNewName("");
    setNewCategory("Farinhas");
    setNewQuantity("");
    setNewUnit("kg");
    setNewCost("");
    setNewMinQuantity("5");
  };

  const updateQuantity = async (id: string, currentQty: number, delta: number) => {
    const ingredientDoc = doc(db, "ingredients", id);
    await updateDoc(ingredientDoc, {
      quantity: Math.max(0, currentQty + delta)
    });
  };

  const removeIngredient = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este ingrediente?")) {
      await deleteDoc(doc(db, "ingredients", id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-bakery-900">Controle de Estoque</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-bakery-700 hover:bg-bakery-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm"
        >
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

        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-bakery-400 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm font-medium">Carregando ingredientes...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                {filteredIngredients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-bakery-400 italic">
                      Nenhum ingrediente encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredIngredients.map((item) => {
                    const isLowStock = item.minQuantity ? item.quantity <= item.minQuantity : false;
                    return (
                      <tr key={item.id} className="hover:bg-bakery-50/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-bakery-900">{item.name}</span>
                            {isLowStock && (
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
                              onClick={() => updateQuantity(item.id, item.quantity, -1)}
                              className="p-1 hover:bg-bakery-100 rounded text-bakery-400 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-mono font-medium text-bakery-900 w-16 text-center">
                              {item.quantity}{item.unit}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity, 1)}
                              className="p-1 hover:bg-bakery-100 rounded text-bakery-400 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-bakery-900">
                          R$ {Number(item.cost || 0).toFixed(2)}
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
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-bakery-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-bakery-50 flex items-center justify-between bg-bakery-50/50">
              <h2 className="text-xl font-bold text-bakery-900">Novo Ingrediente</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-bakery-400 hover:text-bakery-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddIngredient} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-bakery-700 mb-1">Nome do Ingrediente</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  className="w-full bg-bakery-50 border border-bakery-100 rounded-lg py-2 px-3 focus:ring-2 focus:ring-bakery-200 outline-none transition-all"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-bakery-700 mb-1">Categoria</label>
                  <select 
                    className="w-full bg-bakery-50 border border-bakery-100 rounded-lg py-2 px-3 focus:ring-2 focus:ring-bakery-200 outline-none transition-all"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option>Farinhas</option>
                    <option>Laticínios</option>
                    <option>Frutas</option>
                    <option>Outros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-bakery-700 mb-1">Unidade</label>
                  <select 
                    className="w-full bg-bakery-50 border border-bakery-100 rounded-lg py-2 px-3 focus:ring-2 focus:ring-bakery-200 outline-none transition-all"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                  >
                    <option>kg</option>
                    <option>g</option>
                    <option>L</option>
                    <option>ml</option>
                    <option>un</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-bakery-700 mb-1">Qtd. Inicial</label>
                  <input 
                    type="number" 
                    step="any"
                    placeholder="0"
                    className="w-full bg-bakery-50 border border-bakery-100 rounded-lg py-2 px-3 focus:ring-2 focus:ring-bakery-200 outline-none transition-all"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-bakery-700 mb-1">Custo Unit. (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00"
                    className="w-full bg-bakery-50 border border-bakery-100 rounded-lg py-2 px-3 focus:ring-2 focus:ring-bakery-200 outline-none transition-all"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-bakery-700 mb-1">Alerta de Estoque Baixo (Qtd)</label>
                <input 
                  type="number" 
                  step="any"
                  placeholder="5"
                  className="w-full bg-bakery-50 border border-bakery-100 rounded-lg py-2 px-3 focus:ring-2 focus:ring-bakery-200 outline-none transition-all"
                  value={newMinQuantity}
                  onChange={(e) => setNewMinQuantity(e.target.value)}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-bakery-50 hover:bg-bakery-100 text-bakery-600 font-bold py-3 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-bakery-700 hover:bg-bakery-800 text-white font-bold py-3 rounded-xl transition-colors shadow-md shadow-bakery-100"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
