import React, { useState } from 'react';

import { useAppContext } from '@/contexts/AppContext';
import { BRANCH_GERANTS, Gerant } from '@/data/managerData';
import { ArrowLeft, Plus, User, Phone, X, UserPlus, Users } from 'lucide-react';

const OwnerGerants: React.FC = () => {
  const { setScreen, activeBranchId } = useAppContext();
  const branchId = activeBranchId || 'b1';
  
  const [gerants, setGerants] = useState<Gerant[]>(
    BRANCH_GERANTS.filter(g => g.branchId === branchId)
  );
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGerant, setNewGerant] = useState({ name: '', phone: '' });

  const toggleStatus = (id: string) => {
    setGerants(prev => prev.map(g => g.id === id ? { ...g, isActive: !g.isActive } : g));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGerant.name || !newGerant.phone) return;
    
    setGerants([...gerants, {
      id: Math.random().toString(),
      branchId,
      name: newGerant.name,
      phone: newGerant.phone,
      isActive: true,
    }]);
    setShowAddModal(false);
    setNewGerant({ name: '', phone: '' });
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setScreen('owner-branch')}
              className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center active:scale-95 transition-transform"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>
            <div>
              <h1 className="text-lg font-extrabold text-neutral-900">Gérants</h1>
              <p className="text-xs text-neutral-500">Administrateurs du local</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-10 h-10 rounded-full bg-[#87C025] text-white flex items-center justify-center shadow-lg shadow-[#87C025]/30 active:scale-95 transition-transform"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-3">
        {gerants.length === 0 && (
          <div className="text-center py-10 bg-white rounded-2xl shadow-sm">
          <Users className="w-10 h-10 text-neutral-200 mx-auto mb-3" />
          <p className="text-neutral-500 font-extrabold uppercase text-xs tracking-widest">Aucun gérant assigné</p>
          <p className="text-[10px] text-neutral-400 mt-1">Ajoutez un gérant pour piloter ce local</p>
          </div>
        )}
        
        {gerants.map(g => (
          <div key={g.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${g.isActive ? 'bg-[#87C025]/10 text-[#87C025]' : 'bg-neutral-100 text-neutral-400'}`}>
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="font-extrabold text-neutral-900">{g.name}</p>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 mt-1 uppercase tracking-tight">
                   <Phone className="w-3 h-3" />
                   {g.phone}
                </div>
              </div>
            </div>
            
            <button onClick={() => toggleStatus(g.id)} className="active:scale-95 transition-transform">
              <span className={`text-[10px] font-extrabold px-3 py-1.5 rounded-xl border ${g.isActive ? 'text-[#FF4B11] bg-[#FF4B11]/5 border-[#FF4B11]/10' : 'text-[#87C025] bg-[#87C025]/5 border-[#87C025]/10'}`}>
                {g.isActive ? 'DÉSACTIVER' : 'ACTIVER'}
              </span>
            </button>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#87C025]" />
                <h2 className="text-xl font-extrabold text-neutral-900">Nouveau gérant</h2>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 bg-neutral-100 rounded-full active:scale-90 transition-transform">
                <X className="w-5 h-5 text-neutral-600" />
              </button>
            </div>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-neutral-700 block mb-1.5">Nom complet</label>
                <input 
                  required value={newGerant.name} onChange={e => setNewGerant({...newGerant, name: e.target.value})}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[#DC2626]"
                  placeholder="Ex: Babacar Ndiaye"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-neutral-700 block mb-1.5">Téléphone</label>
                <input 
                  required type="tel" value={newGerant.phone} onChange={e => setNewGerant({...newGerant, phone: e.target.value})}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[#DC2626]"
                  placeholder="77 123 45 67"
                />
              </div>
              <button type="submit" className="w-full bg-[#87C025] text-white font-extrabold py-4 rounded-2xl mt-4 shadow-lg shadow-[#87C025]/30 active:scale-[0.98] transition-transform uppercase tracking-wider text-sm">
                Ajouter ce gérant
              </button>
            </form>
          </div>
        </div>
      )}
      <style>{`
        @keyframes slide-up { from { transform: translateY(100%);} to { transform: translateY(0);} }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default OwnerGerants;





