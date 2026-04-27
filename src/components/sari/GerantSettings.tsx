import React, { useState } from 'react';
import { ArrowLeft, Clock, MapPin, Phone, CreditCard, Save, Image as ImageIcon } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

const GerantSettings: React.FC = () => {
  const { setScreen } = useAppContext();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => setScreen('gerant-dashboard')}
            className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-700" />
          </button>
          <div>
            <h1 className="text-lg font-extrabold text-neutral-900">Paramètres</h1>
            <p className="text-xs text-neutral-500">Configuration du local</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-4">
        {/* Status */}
        <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-neutral-900">Statut du restaurant</h3>
            <p className="text-xs text-neutral-500 mt-1">Activer ou fermer temporairement</p>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`relative w-14 h-8 rounded-full transition-all flex-shrink-0 ${
              isOpen ? 'bg-[#16A34A]' : 'bg-neutral-300'
            }`}
          >
            <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${
              isOpen ? 'left-7' : 'left-1'
            }`} />
          </button>
        </div>

        {/* Banner Upload */}
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-neutral-900 mb-2">Image de couverture</h3>
          <div className="w-full h-32 bg-neutral-50 rounded-xl overflow-hidden relative border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center hover:border-[#C94A2A] transition-colors">
            <ImageIcon className="w-8 h-8 text-neutral-400 mb-2" />
            <span className="text-xs text-neutral-500 font-bold">Changer la bannière du local</span>
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
        </div>

        {/* Opening Hours */}
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-extrabold text-sm text-neutral-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C94A2A]" /> Horaires d'ouverture
            </h3>
          </div>
          
          <div className="space-y-3">
            {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day, idx) => (
              <div key={day} className="flex items-center justify-between py-1 border-b border-neutral-50 last:border-0">
                <span className={`text-xs font-bold ${idx > 4 ? 'text-[#C94A2A]' : 'text-neutral-600'}`}>{day}</span>
                <div className="flex items-center gap-2">
                  <input type="text" defaultValue="09:00" className="w-14 bg-neutral-50 text-[11px] font-bold text-center border rounded py-1 outline-none focus:border-[#C94A2A]" />
                  <span className="text-neutral-400 text-[10px]">à</span>
                  <input type="text" defaultValue="22:00" className="w-14 bg-neutral-50 text-[11px] font-bold text-center border rounded py-1 outline-none focus:border-[#C94A2A]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-neutral-900 mb-2">Paramètres de livraison</h3>
          
          <div>
            <label className="text-xs font-bold text-neutral-500 block mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> Téléphone de contact
            </label>
            <input 
              type="tel" defaultValue="77 123 45 67"
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[#C94A2A] text-sm font-semibold text-neutral-900"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-500 block mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Rayon de livraison (km)
            </label>
            <input 
              type="number" defaultValue="5"
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[#C94A2A] text-sm font-semibold text-neutral-900"
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-5 py-4 z-20 max-w-md mx-auto">
        <button
          onClick={() => setScreen('gerant-dashboard')}
          className="w-full bg-[#C94A2A] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#C94A2A]/30 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" /> Enregistrer
        </button>
      </div>
    </div>
  );
};

export default GerantSettings;
