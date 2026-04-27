import React, { useState } from 'react';
import { ArrowLeft, Search, Check, X, AlertCircle } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { getRestaurantMenu, RESTAURANTS, formatPrice } from '@/data/sariData';
import { toast } from 'sonner';

const GerantInventory: React.FC = () => {
  const { setScreen, activeBranchId } = useAppContext();
  const branchId = activeBranchId || 'b1';
  const restaurant = RESTAURANTS[0]; // Simulation: gérant du premier restaurant
  const [menu, setMenu] = useState(getRestaurantMenu(restaurant.id));
  const [search, setSearch] = useState('');

  const filtered = menu.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  const toggleStatus = (id: string, currentStatus: boolean) => {
    setMenu(prev => prev.map(item => 
      item.id === id ? { ...item, outOfStock: !currentStatus } : item
    ));
    toast(currentStatus ? "Article marqué en rupture" : "Article remis en stock", {
      icon: currentStatus ? <AlertCircle className="text-red-500" /> : <Check className="text-green-500" />,
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="px-5 py-4 flex items-center gap-3">
          <button onClick={() => setScreen('gerant-dashboard')} className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-extrabold text-neutral-900">Stocks & Disponibilité</h1>
            <p className="text-xs text-neutral-500">Activez/Désactivez les articles du menu</p>
          </div>
        </div>
        <div className="px-5 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un plat..." 
              className="w-full bg-neutral-100 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 ring-[#7C3AED]/20"
            />
          </div>
        </div>
      </div>

      <div className="p-5 space-y-3">
        {filtered.map(item => {
          const isOut = (item as any).outOfStock;
          return (
            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 transition-all border border-neutral-100">
              <div className={`w-14 h-14 rounded-xl overflow-hidden grayscale-[${isOut ? 1 : 0}] opacity-${isOut ? 50 : 100}`}>
                <img src={item.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-sm ${isOut ? 'text-neutral-400 line-through' : 'text-neutral-900'}`}>{item.name}</h3>
                <p className="text-xs text-neutral-500">{formatPrice(item.price)}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <button
                  onClick={() => toggleStatus(item.id, !isOut)}
                  className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all ${
                    isOut 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {isOut ? 'Remettre' : 'Rupture'}
                </button>
                {isOut && <span className="text-[10px] font-bold text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Masqué</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GerantInventory;
