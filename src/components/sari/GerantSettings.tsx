import React, { useState } from 'react';

import { useAppContext } from '@/contexts/AppContext';
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  Clock, 
  Phone, 
  MapPin, 
  Save, 
  Settings,
  Bell,
  Lock,
  Globe,
  Truck
} from 'lucide-react';

const GerantSettings: React.FC = () => {
  const { setScreen } = useAppContext();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      <div className="bg-white sticky top-0 z-20 border-b border-neutral-100 shadow-sm">
        <div className="px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => setScreen('gerant-dashboard')}
            className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center active:scale-90 transition-all hover:bg-neutral-200"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-600" />
          </button>
          <div>
            <h1 className="text-xl font-black text-neutral-900 leading-none">Paramètres</h1>
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-1">Configuration du local</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-4">
        {/* Status */}
        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-neutral-100 flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isOpen ? 'bg-[#87C025]/10 text-[#87C025]' : 'bg-red-50 text-red-500'}`}>
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base text-neutral-900 leading-tight">Statut de visibilité</h3>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Ouvert / Fermé temporairement</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`relative w-14 h-8 rounded-full transition-all duration-300 flex-shrink-0 shadow-inner ${
              isOpen ? 'bg-[#87C025]' : 'bg-neutral-300'
            }`}
          >
            <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-300 ${
              isOpen ? 'left-7' : 'left-1'
            }`} />
          </button>
        </div>

        {/* Banner Upload */}
        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-neutral-100 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="w-4 h-4 text-neutral-400" />
            <h3 className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em]">Image de couverture</h3>
          </div>
          <div className="w-full h-40 bg-neutral-50 rounded-[24px] overflow-hidden relative border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center hover:border-[#FF4B11] hover:bg-neutral-100 transition-all group">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-6 h-6 text-neutral-300" />
            </div>
            <span className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Modifier la bannière</span>
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
        </div>

        {/* Opening Hours */}
        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-neutral-100 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#87C025]" />
              <h3 className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em]">Horaires d'ouverture</h3>
            </div>
          </div>
          
          <div className="space-y-4">
            {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day, idx) => (
              <div key={day} className="flex items-center justify-between group">
                <span className={`text-xs font-black uppercase tracking-tight ${idx > 4 ? 'text-[#FF4B11]' : 'text-neutral-500'}`}>{day}</span>
                <div className="flex items-center gap-3">
                  <input type="text" defaultValue="09:00" className="w-16 bg-neutral-50 text-xs font-black text-center border-2 border-transparent focus:border-[#FF4B11]/20 focus:bg-white rounded-xl py-2 outline-none transition-all text-neutral-900" />
                  <span className="text-neutral-300 font-black text-[10px] uppercase">à</span>
                  <input type="text" defaultValue="22:00" className="w-16 bg-neutral-50 text-xs font-black text-center border-2 border-transparent focus:border-[#FF4B11]/20 focus:bg-white rounded-xl py-2 outline-none transition-all text-neutral-900" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-neutral-100 space-y-6">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-neutral-400" />
            <h3 className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em]">Logistique</h3>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 block ml-1">Téléphone de contact</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                <input 
                  type="tel" defaultValue="77 123 45 67"
                  className="w-full bg-neutral-50 border-2 border-transparent focus:border-[#FF4B11]/20 focus:bg-white rounded-[20px] pl-11 pr-4 py-3.5 outline-none transition-all font-bold text-neutral-900 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 block ml-1">Rayon de livraison (km)</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                <input 
                  type="number" defaultValue="5"
                  className="w-full bg-neutral-50 border-2 border-transparent focus:border-[#FF4B11]/20 focus:bg-white rounded-[20px] pl-11 pr-4 py-3.5 outline-none transition-all font-bold text-neutral-900 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-neutral-100 px-5 py-5 z-20 max-w-md mx-auto">
        <button
          onClick={() => setScreen('gerant-dashboard')}
          className="w-full bg-[#87C025] text-white font-black py-4.5 rounded-[24px] shadow-xl shadow-[#87C025]/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[11px] hover:bg-[#76a820]"
        >
          <Save className="w-5 h-5" /> Enregistrer les réglages
        </button>
      </div>
    </div>
  );
};

export default GerantSettings;





