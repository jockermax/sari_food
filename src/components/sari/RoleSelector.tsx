import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { LOGO_URL } from '@/data/sariData';

const RoleSelector: React.FC = () => {
  const { setScreen, setRole, setIsAuthenticated } = useAppContext();

  const handleClient = () => {
    setRole('client');
    setIsAuthenticated(true);
    setScreen('location');
  };

  const handleOwner = () => {
    setRole('owner');
    setIsAuthenticated(true);
    setScreen('owner-dashboard');
  };

  const handleGerant = () => {
    setRole('gerant');
    setIsAuthenticated(true);
    setScreen('gerant-dashboard');
  };

  const handleLivreur = () => {
    setRole('livreur');
    setIsAuthenticated(true);
    setScreen('livreur-dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FDF6EC] flex flex-col">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-8 text-center border-b border-neutral-100">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-xl">
            <img src={LOGO_URL} alt="SARI" className="w-full h-full object-cover" />
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-neutral-900 mb-1">SARI FOOD</h1>
        <p className="text-sm text-neutral-500">Sélectionnez votre espace de connexion</p>
        <div className="mt-3 inline-flex items-center gap-2 bg-[#F4A012]/15 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-[#F4A012]" />
          <span className="text-xs font-bold text-[#C94A2A]">Mode démo — prototype</span>
        </div>
      </div>

      {/* Role cards */}
      <div className="flex-1 px-5 pt-8 space-y-4">

        {/* Client */}
        <button
          onClick={handleClient}
          className="w-full rounded-3xl p-5 text-left active:scale-[0.98] transition-transform shadow-sm border-2 bg-[#FDF6EC]"
          style={{ borderColor: '#C94A2A20' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm flex-shrink-0 bg-[#C94A2A15]">
              🛵
            </div>
            <div className="flex-1">
              <p className="font-extrabold text-lg text-neutral-900">Client</p>
              <p className="text-sm text-neutral-500 mt-0.5">Commander depuis mon fast food préféré</p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-[#C94A2A]">
              <span className="text-white text-lg font-bold">›</span>
            </div>
          </div>
        </button>

        {/* Owner */}
        <button
          onClick={handleOwner}
          className="w-full rounded-3xl p-5 text-left active:scale-[0.98] transition-transform shadow-sm border-2 bg-[#F5F3FF]"
          style={{ borderColor: '#7C3AED20' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm flex-shrink-0 bg-[#7C3AED15]">
              🏪
            </div>
            <div className="flex-1">
              <p className="font-extrabold text-lg text-neutral-900">Propriétaire</p>
              <p className="text-sm text-neutral-500 mt-0.5 leading-snug">
                Gérer mes restaurants & créer de nouveaux locaux
              </p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-[#7C3AED]">
              <span className="text-white text-lg font-bold">›</span>
            </div>
          </div>
          {/* Badge multi-branch */}
          <div className="mt-3 ml-20">
            <span className="inline-flex items-center gap-1.5 bg-[#7C3AED]/10 px-3 py-1 rounded-full">
              <span className="text-[10px] font-bold text-[#7C3AED]">✦ Multi-locaux · Toutes les villes</span>
            </span>
          </div>
        </button>

        {/* Gerant */}
        <button
          onClick={handleGerant}
          className="w-full rounded-3xl p-5 text-left active:scale-[0.98] transition-transform shadow-sm border-2 bg-[#F0FDF4]"
          style={{ borderColor: '#16A34A20' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm flex-shrink-0 bg-[#16A34A15]">
              👨‍🍳
            </div>
            <div className="flex-1">
              <p className="font-extrabold text-lg text-neutral-900">Gérant</p>
              <p className="text-sm text-neutral-500 mt-0.5 leading-snug">
                Gérer les commandes et le menu d'un local spécifique
              </p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-[#16A34A]">
              <span className="text-white text-lg font-bold">›</span>
            </div>
          </div>
          {/* Badge local */}
          <div className="mt-3 ml-20">
            <span className="inline-flex items-center gap-1.5 bg-[#16A34A]/10 px-3 py-1 rounded-full">
              <span className="text-[10px] font-bold text-[#16A34A]">📍 Un seul local · Commandes en direct</span>
            </span>
          </div>
        </button>

        {/* Livreur */}
        <button
          onClick={handleLivreur}
          className="w-full rounded-3xl p-5 text-left active:scale-[0.98] transition-transform shadow-sm border-2 bg-[#EFF6FF]"
          style={{ borderColor: '#2563EB20' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm flex-shrink-0 bg-[#2563EB15]">
              🛵
            </div>
            <div className="flex-1">
              <p className="font-extrabold text-lg text-neutral-900">Livreur</p>
              <p className="text-sm text-neutral-500 mt-0.5 leading-snug">
                Prendre en charge les commandes et livrer les clients
              </p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-[#2563EB]">
              <span className="text-white text-lg font-bold">›</span>
            </div>
          </div>
          {/* Badge livreur */}
          <div className="mt-3 ml-20">
            <span className="inline-flex items-center gap-1.5 bg-[#2563EB]/10 px-3 py-1 rounded-full">
              <span className="text-[10px] font-bold text-[#2563EB]">📦 Prise en charge · GPS & Maps</span>
            </span>
          </div>
        </button>
      </div>

      <p className="text-center text-xs text-neutral-400 py-6">
        SARI v1.0 · Prototype de démonstration
      </p>
    </div>
  );
};

export default RoleSelector;
