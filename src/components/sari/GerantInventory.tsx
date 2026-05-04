import React, { useState } from 'react';

import { useAppContext } from '@/contexts/AppContext';
import { getRestaurantMenu, RESTAURANTS, formatPrice } from '@/data/sariData';
import { toast } from 'sonner';
import { ArrowLeft, Search, AlertCircle, CheckCircle, Package, Filter, XCircle } from 'lucide-react';

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
    toast(currentStatus ? "Article marqué en rupture" : "Article remis en stock");
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 border-b border-neutral-100 shadow-sm">
        <div className="px-5 py-4 flex items-center gap-3">
          <button 
            onClick={() => setScreen('gerant-dashboard')} 
            className="w-11 h-11 rounded-2xl bg-neutral-100 flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-900" />
          </button>
          <div>
            <h1 className="text-base font-black text-neutral-900 uppercase tracking-tighter">Stocks & Disponibilité</h1>
            <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mt-0.5">Activez / Désactivez vos articles</p>
          </div>
        </div>
        <div className="px-5 pb-5">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400 group-focus-within:text-[#87C025] transition-colors" />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un plat..." 
              className="w-full bg-neutral-100 rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none border-2 border-transparent focus:bg-white focus:border-[#87C025]/20 transition-all font-bold placeholder:text-neutral-400"
            />
          </div>
        </div>
      </div>

      <div className="p-5 space-y-3">
        {filtered.map(item => {
          const isOut = (item as any).outOfStock;
          return (
            <div key={item.id} className={`bg-white rounded-3xl p-4 shadow-sm flex items-center gap-4 transition-all border ${isOut ? 'border-red-100 opacity-60' : 'border-neutral-100'}`}>
              <div className={`w-16 h-16 rounded-2xl overflow-hidden shadow-sm transition-all ${isOut ? 'grayscale scale-90 opacity-50' : ''}`}>
                <img src={item.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-black text-sm uppercase tracking-tight leading-tight ${isOut ? 'text-neutral-400 line-through' : 'text-neutral-900'}`}>{item.name}</h3>
                <p className="text-sm font-black text-[#87C025] mt-1">{formatPrice(item.price)}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <button
                  onClick={() => toggleStatus(item.id, !isOut)}
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-90 ${
                    isOut 
                      ? 'bg-[#87C025] text-white shadow-[#87C025]/30' 
                      : 'bg-[#FF4B11] text-white shadow-[#FF4B11]/30'
                  }`}
                >
                  {isOut ? 'Réactiver' : 'Rupture'}
                </button>
                {isOut && (
                  <div className="flex items-center gap-1 text-[9px] font-black text-[#FF4B11] uppercase tracking-tighter bg-red-50 px-2 py-0.5 rounded-lg border border-red-100">
                    <XCircle className="w-3 h-3" />
                    Indisponible
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GerantInventory;





