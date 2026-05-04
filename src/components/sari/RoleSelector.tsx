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
        <div className="mt-3 inline-flex items-center gap-2 bg-[#FF4B11]/15 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-[#FF4B11]" />
          <span className="text-xs font-bold text-[#FF4B11]">Mode démo — prototype</span>
        </div>
      </div>

      {/* Role cards */}
      <div className="flex-1 px-5 pt-8 space-y-4">

        {/* Client */}
        <button
          onClick={handleClient}
          className="w-full rounded-3xl p-5 text-left active:scale-[0.98] transition-transform shadow-sm border-2 bg-[#FDF6EC]"
          style={{ borderColor: '#FF4B1120' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm flex-shrink-0 bg-[#FF4B11]15]">
              🛵
            </div>
            <div className="flex-1">
              <p className="font-extrabold text-lg text-neutral-900">Client</p>
              <p className="text-sm text-neutral-500 mt-0.5">Commander depuis mon fast food préféré</p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-[#FF4B11]">
              <span className="text-white text-lg font-bold">›</span>
            </div>
          </div>
        </button>

        {/* Owner */}
        <button
          onClick={handleOwner}
          className="w-full rounded-3xl p-5 text-left active:scale-[0.98] transition-transform shadow-sm border-2 bg-[#FDF6EC]"
          style={{ borderColor: '#87C02520' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm flex-shrink-0 bg-[#87C025]15]">
              🏪
            </div>
            <div className="flex-1">
              <p className="font-extrabold text-lg text-neutral-900">Propriétaire</p>
              <p className="text-sm text-neutral-500 mt-0.5 leading-snug">
                Gérer mes restaurants & créer de nouveaux locaux
              </p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-[#87C025]">
              <span className="text-white text-lg font-bold">›</span>
            </div>
          </div>
          {/* Badge multi-branch */}
          <div className="mt-3 ml-20">
            <span className="inline-flex items-center gap-1.5 bg-[#87C025]/10 px-3 py-1 rounded-full">
              <span className="text-[10px] font-bold text-[#87C025]">✦ Multi-locaux · Toutes les villes</span>
            </span>
          </div>
        </button>

        {/* Gerant */}
        <button
          onClick={handleGerant}
          className="w-full rounded-3xl p-5 text-left active:scale-[0.98] transition-transform shadow-sm border-2 bg-[#FDF6EC]"
          style={{ borderColor: '#87C02520' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm flex-shrink-0 bg-[#87C025]15]">
              👨‍🍳
            </div>
            <div className="flex-1">
              <p className="font-extrabold text-lg text-neutral-900">Gérant</p>
              <p className="text-sm text-neutral-500 mt-0.5 leading-snug">
                Gérer les commandes et le menu d'un local spécifique
              </p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-[#87C025]">
              <span className="text-white text-lg font-bold">›</span>
            </div>
          </div>
          {/* Badge local */}
          <div className="mt-3 ml-20">
            <span className="inline-flex items-center gap-1.5 bg-[#87C025]/10 px-3 py-1 rounded-full">
              <span className="text-[10px] font-bold text-[#87C025]">📍 Un seul local · Commandes en direct</span>
            </span>
          </div>
        </button>

        {/* Livreur */}
        <button
          onClick={handleLivreur}
          className="w-full rounded-3xl p-5 text-left active:scale-[0.98] transition-transform shadow-sm border-2 bg-[#FDF6EC]"
          style={{ borderColor: '#FF4B1120' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm flex-shrink-0 bg-[#FF4B11]15]">
              🛵
            </div>
            <div className="flex-1">
              <p className="font-extrabold text-lg text-neutral-900">Livreur</p>
              <p className="text-sm text-neutral-500 mt-0.5 leading-snug">
                Prendre en charge les commandes et livrer les clients
              </p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-[#FF4B11]">
              <span className="text-white text-lg font-bold">›</span>
            </div>
          </div>
          {/* Badge livreur */}
          <div className="mt-3 ml-20">
            <span className="inline-flex items-center gap-1.5 bg-[#FF4B11]/10 px-3 py-1 rounded-full">
              <span className="text-[10px] font-bold text-[#FF4B11]">📦 Prise en charge · GPS & Maps</span>
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





