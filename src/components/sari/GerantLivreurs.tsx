import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const livreurSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  phone: z.string().regex(/^(77|78|76|75|70|33)\s?\d{3}\s?\d{2}\s?\d{2}$/, 'Format invalide. Ex: 77 123 45 67'),
});

type LivreurFormValues = z.infer<typeof livreurSchema>;
import { useAppContext } from '@/contexts/AppContext';
import { BRANCH_LIVREURS, Livreur } from '@/data/managerData';
import { 
  ArrowLeft, 
  Plus, 
  Bike, 
  Phone, 
  X, 
  UserPlus, 
  History, 
  CheckCircle, 
  AlertCircle,
  ChevronRight
} from 'lucide-react';

const GerantLivreurs: React.FC = () => {
  const { setScreen, activeBranchId, role } = useAppContext();
  const branchId = activeBranchId || 'b1';
  
  const [livreurs, setLivreurs] = useState<Livreur[]>(
    BRANCH_LIVREURS.filter(l => l.branchId === branchId)
  );
  
  const [showAddModal, setShowAddModal] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LivreurFormValues>({
    resolver: zodResolver(livreurSchema)
  });

  const toggleStatus = (id: string) => {
    setLivreurs(prev => prev.map(l => l.id === id ? { ...l, isActive: !l.isActive } : l));
  };

  const onSubmit = (data: LivreurFormValues) => {
    setLivreurs([...livreurs, {
      id: Math.random().toString(),
      branchId,
      name: data.name,
      phone: data.phone,
      isActive: true,
      ordersDelivered: 0
    }]);
    setShowAddModal(false);
    reset();
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      <div className="bg-white sticky top-0 z-20 border-b border-neutral-100 shadow-sm">
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setScreen(role === 'owner' ? 'owner-branch' : 'gerant-dashboard')}
              className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center active:scale-90 transition-all hover:bg-neutral-200"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>
            <div>
              <h1 className="text-xl font-black text-neutral-900 leading-none">Livreurs</h1>
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-1">Équipe de livraison</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-11 h-11 rounded-[16px] bg-[#87C025] text-white flex items-center justify-center shadow-lg shadow-[#87C025]/30 active:scale-90 transition-all hover:bg-[#76a820]"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-3">
        {livreurs.length === 0 && (
          <div className="text-center py-10 bg-white rounded-2xl shadow-sm">
            <Bike className="w-10 h-10 text-neutral-200 mx-auto mb-3" />
            <p className="text-neutral-500 font-extrabold uppercase text-xs tracking-widest">Aucun livreur assigné</p>
            <p className="text-[10px] text-neutral-400 mt-1">Ajoutez un livreur pour ce local</p>
          </div>
        )}
        
        {livreurs.map(l => (
          <div key={l.id} className="bg-white rounded-[28px] p-5 shadow-sm border border-neutral-100 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center transition-all ${l.isActive ? 'bg-gradient-to-br from-[#87C025] to-[#76a820] text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                  <Bike className="w-7 h-7" />
                </div>
                {l.isActive && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-lg shadow-sm flex items-center justify-center border border-neutral-50">
                    <div className="w-2.5 h-2.5 bg-[#87C025] rounded-full animate-pulse" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-black text-neutral-900 text-base leading-tight mb-1">{l.name}</p>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-tight">
                    <Phone className="w-3 h-3 text-[#FF4B11]" />
                    {l.phone}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                    <History className="w-3 h-3" />
                    {l.ordersDelivered} courses
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => toggleStatus(l.id)} 
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-90 ${
                l.isActive 
                  ? 'bg-red-50 text-red-600 border border-red-100' 
                  : 'bg-green-50 text-green-600 border border-green-100'
              }`}
            >
              {l.isActive ? 'Suspendre' : 'Activer'}
            </button>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-neutral-900 leading-none">Nouveau livreur</h2>
                <p className="text-xs font-bold text-neutral-400 mt-2">Ajoutez un collaborateur à l'équipe</p>
              </div>
              <button 
                onClick={() => { setShowAddModal(false); reset(); }} 
                className="w-10 h-10 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-400 hover:bg-neutral-100 active:scale-90 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 block ml-1">Nom complet</label>
                <div className="relative">
                  <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300" />
                  <input 
                    {...register('name')}
                    className={`w-full bg-neutral-50 border-2 ${errors.name ? 'border-red-500' : 'border-transparent focus:border-[#FF4B11]/20 focus:bg-white'} rounded-2xl pl-12 pr-4 py-4 outline-none transition-all font-bold text-neutral-900 placeholder:text-neutral-300`}
                    placeholder="Ex: Amadou Diallo"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 block ml-1">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300" />
                  <input 
                    type="tel"
                    {...register('phone')}
                    className={`w-full bg-neutral-50 border-2 ${errors.phone ? 'border-red-500' : 'border-transparent focus:border-[#FF4B11]/20 focus:bg-white'} rounded-2xl pl-12 pr-4 py-4 outline-none transition-all font-bold text-neutral-900 placeholder:text-neutral-300`}
                    placeholder="77 123 45 67"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-1">{errors.phone.message}</p>}
              </div>
              <button type="submit" className="w-full bg-[#87C025] text-white font-black py-4.5 rounded-[20px] mt-4 shadow-xl shadow-[#87C025]/30 active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-[11px] hover:bg-[#76a820]">
                Ajouter à l'équipe
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

export default GerantLivreurs;





