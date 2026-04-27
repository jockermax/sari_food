import React, { useState } from 'react';
import { ArrowLeft, Plus, X, Truck, ToggleLeft, ToggleRight, Phone } from 'lucide-react';
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
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setScreen(role === 'owner' ? 'owner-branch' : 'gerant-dashboard')}
              className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-700" />
            </button>
            <div>
              <h1 className="text-lg font-extrabold text-neutral-900">Livreurs</h1>
              <p className="text-xs text-neutral-500">Gérer l'équipe de livraison</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center shadow-lg active:scale-95"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-3">
        {livreurs.length === 0 && (
          <div className="text-center py-10 bg-white rounded-2xl shadow-sm">
            <Truck className="w-12 h-12 text-neutral-200 mx-auto mb-2" />
            <p className="text-neutral-500 font-bold">Aucun livreur assigné</p>
          </div>
        )}
        
        {livreurs.map(l => (
          <div key={l.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${l.isActive ? 'bg-[#EFF6FF]' : 'bg-neutral-100'}`}>
                <Truck className={`w-6 h-6 ${l.isActive ? 'text-[#2563EB]' : 'text-neutral-400'}`} />
              </div>
              <div>
                <p className="font-extrabold text-neutral-900">{l.name}</p>
                <div className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5">
                  <Phone className="w-3 h-3" /> {l.phone}
                </div>
                <p className="text-[10px] font-bold text-neutral-400 mt-1">{l.ordersDelivered} courses terminées</p>
              </div>
            </div>
            
            <button onClick={() => toggleStatus(l.id)} className="active:scale-95 transition-transform">
              {l.isActive 
                ? <ToggleRight className="w-8 h-8 text-[#16A34A]" />
                : <ToggleLeft className="w-8 h-8 text-neutral-300" />
              }
            </button>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-neutral-900">Nouveau livreur</h2>
              <button onClick={() => { setShowAddModal(false); reset(); }} className="p-2 bg-neutral-100 rounded-full">
                <X className="w-5 h-5 text-neutral-600" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-neutral-700 block mb-1.5">Nom complet</label>
                <input 
                  {...register('name')}
                  className={`w-full bg-neutral-50 border ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-[#2563EB]'} rounded-xl px-4 py-3 outline-none`}
                  placeholder="Ex: Amadou Diallo"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="text-sm font-semibold text-neutral-700 block mb-1.5">Téléphone</label>
                <input 
                  type="tel"
                  {...register('phone')}
                  className={`w-full bg-neutral-50 border ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-[#2563EB]'} rounded-xl px-4 py-3 outline-none`}
                  placeholder="77 123 45 67"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
              <button type="submit" className="w-full bg-[#2563EB] text-white font-bold py-4 rounded-xl mt-4 shadow-lg active:scale-[0.98] transition-transform">
                Ajouter ce livreur
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
