import React, { useState } from 'react';

import { useAppContext } from '@/contexts/AppContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const addressSchema = z.object({
  label: z.string().min(1, 'Veuillez choisir un type'),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  detail: z.string().optional(),
});
type AddressFormValues = z.infer<typeof addressSchema>;

interface SavedAddress {
  id: string;
  label: string;
  address: string;
  detail?: string;
  icon: 'home' | 'work' | 'other';
}

const INITIAL: SavedAddress[] = [
  { id: '1', label: 'Maison', address: 'Cité Niakh, Villa 12, Mbour Centre', detail: 'Portail rouge', icon: 'home' },
  { id: '2', label: 'Bureau', address: 'Zone industrielle, Imm. Saly Business', detail: '3ème étage, bureau 305', icon: 'work' },
];

const COLOR_MAP = { home: 'bg-[#FDF6EC] text-[#FF4B11]', work: 'bg-[#FDF6EC] text-[#87C025]', other: 'bg-[#FDF6EC] text-[#FF4B11]' };

const AddressBook: React.FC = () => {
  const { setScreen } = useAppContext();
  const [addresses, setAddresses] = useState<SavedAddress[]>(INITIAL);
  const [showModal, setShowModal] = useState(false);
  const [iconType, setIconType] = useState<'home' | 'work' | 'other'>('home');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: { label: 'Maison' },
  });

  const onSubmit = (data: AddressFormValues) => {
    setAddresses(prev => [...prev, {
      id: Math.random().toString(),
      label: data.label,
      address: data.address,
      detail: data.detail,
      icon: iconType,
    }]);
    setShowModal(false);
    reset();
    setIconType('home');
  };

  const handleDelete = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => setScreen('profile')}
            className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center active:scale-95"
          >
            
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-extrabold text-neutral-900">Mes adresses</h1>
            <p className="text-xs text-neutral-500">Gérez vos lieux de livraison favoris</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="w-10 h-10 rounded-full bg-[#FF4B11] flex items-center justify-center shadow-lg active:scale-95"
          >
            
          </button>
        </div>
      </div>

      {/* Address list */}
      <div className="px-5 pt-5 space-y-3">
        {addresses.length === 0 && (
          <div className="text-center py-16">
            
            <p className="font-bold text-neutral-500">Aucune adresse enregistrée</p>
            <p className="text-xs text-neutral-400 mt-1">Ajoutez vos adresses favorites pour commander plus vite</p>
          </div>
        )}

        {addresses.map(addr => {
          return (
            <div key={addr.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-extrabold text-xs ${colorClass}`}>
                {addr.label[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-neutral-900 text-sm">{addr.label}</p>
                <p className="text-xs text-neutral-600 mt-0.5 truncate">{addr.address}</p>
                {addr.detail && (
                  <p className="text-[11px] text-neutral-400 mt-0.5">{addr.detail}</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(addr.id)}
                className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 active:scale-90"
              >
                
              </button>
            </div>
          );
        })}

        {/* Add address CTA */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-white rounded-2xl p-4 shadow-sm border-2 border-dashed border-[#FF4B11]/30 flex items-center gap-3 active:scale-[0.98] transition-transform"
        >
          <div className="w-12 h-12 rounded-xl bg-[#FDF6EC] flex items-center justify-center">
            
          </div>
          <div className="text-left">
            <p className="font-bold text-neutral-900 text-sm">Ajouter une adresse</p>
            <p className="text-xs text-neutral-400">Maison, bureau, ou autre lieu</p>
          </div>
        </button>
      </div>

      {/* Add Address Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => { setShowModal(false); reset(); }} />
          <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6" style={{ animation: 'slideUp 0.3s ease-out' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-neutral-900">Nouvelle adresse</h2>
              <button onClick={() => { setShowModal(false); reset(); }} className="p-2 bg-neutral-100 rounded-full">
                
              </button>
            </div>

            {/* Icon type selector */}
            <div className="flex gap-3 mb-5">
              {(['home', 'work', 'other'] as const).map(t => {
                const labels = { home: 'Maison', work: 'Bureau', other: 'Autre' };
                return (
                  <button
                    key={t}
                    onClick={() => { setIconType(t); }}
                    className={`flex-1 py-3 rounded-xl flex flex-col items-center justify-center border-2 transition-all ${
                      iconType === t
                        ? 'border-[#FF4B11] bg-[#FDF6EC]'
                        : 'border-neutral-100 bg-neutral-50'
                    }`}
                  >
                    <span className={`text-xs font-bold ${iconType === t ? 'text-[#FF4B11]' : 'text-neutral-500'}`}>{labels[t]}</span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-neutral-700 block mb-1.5">Nom de l'adresse</label>
                <input
                  {...register('label')}
                  className={`w-full bg-neutral-50 border ${errors.label ? 'border-red-500' : 'border-neutral-200'} rounded-xl px-4 py-3 outline-none focus:border-[#FF4B11] text-sm`}
                  placeholder="Ex: Maison, Bureau, Chez maman..."
                />
                {errors.label && <p className="text-red-500 text-xs mt-1">{errors.label.message}</p>}
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-700 block mb-1.5">Adresse complète</label>
                <input
                  {...register('address')}
                  className={`w-full bg-neutral-50 border ${errors.address ? 'border-red-500' : 'border-neutral-200'} rounded-xl px-4 py-3 outline-none focus:border-[#FF4B11] text-sm`}
                  placeholder="Ex: Quartier Mbour 3, Villa 7..."
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-700 block mb-1.5">Indication supplémentaire <span className="text-neutral-400 font-normal">(optionnel)</span></label>
                <input
                  {...register('detail')}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[#FF4B11] text-sm"
                  placeholder="Ex: Portail bleu, 2ème étage..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#FF4B11] text-white font-bold py-4 rounded-xl mt-2 shadow-lg shadow-[#FF4B11]/30 active:scale-[0.98] transition-transform"
              >
                Enregistrer cette adresse
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
    </div>
  );
};

export default AddressBook;





