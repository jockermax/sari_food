import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import BottomNav from './BottomNav';
import { LOGO_URL } from '@/data/sariData';

interface SavedAddress {
  id: string;
  label: string;
  address: string;
  detail?: string;
  icon: 'home' | 'work' | 'other';
}

const ProfileScreen: React.FC = () => {
  const { phone, location, setScreen, setIsAuthenticated, clearCart, favorites } = useAppContext();

  const [addresses, setAddresses] = useState<SavedAddress[]>([
    { id: 'a1', label: 'Maison', address: 'Rue des Baobabs, Thiès Centre', icon: 'home' },
    { id: 'a2', label: 'Bureau', address: 'Zone Industrielle, Thiès Nord', icon: 'work' },
  ]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newIcon, setNewIcon] = useState<'home' | 'work' | 'other'>('home');

  const handleLogout = () => {
    setIsAuthenticated(false);
    clearCart();
    setScreen('onboarding');
  };

  const addAddress = () => {
    if (!newLabel.trim() || !newAddress.trim()) return;
    setAddresses(prev => [...prev, {
      id: `a${Date.now()}`, label: newLabel.trim(), address: newAddress.trim(), icon: newIcon,
    }]);
    setNewLabel(''); setNewAddress(''); setNewIcon('home');
    setShowAddressModal(false);
  };

  const removeAddress = (id: string) => setAddresses(prev => prev.filter(a => a.id !== id));

  const menuItems: Array<{ label: string; desc: string; action: () => void; badge?: number; highlight?: boolean }> = [
    { label: 'MOYENS DE PAIEMENT', desc: 'Wave, Orange Money...', action: () => {} },
    {
      label: 'MES FAVORIS',
      desc: favorites.length > 0 ? `${favorites.length} restaurant${favorites.length > 1 ? 's' : ''} sauvegardé${favorites.length > 1 ? 's' : ''}` : "Aucun favori pour l'instant",
      action: () => setScreen('favorites'), badge: favorites.length, highlight: favorites.length > 0,
    },
    { label: 'PARRAINAGE',       desc: 'Invitez et gagnez 2 000 FCFA', action: () => {} },
    { label: 'NOTIFICATIONS',     desc: 'Gérer les alertes',              action: () => {} },
    { label: 'AIDE & SUPPORT',    desc: 'FAQ, nous contacter',             action: () => {} },
    { label: 'CHANGER DE RÔLE',   desc: 'Démo : Propriétaire/Admin',             action: () => setScreen('role-select') },
  ];

  return (
    <div className="min-h-screen bg-[#FDF6EC] pb-24">
      <div className="bg-[#FF4B11] px-5 pt-8 pb-16 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#FF4B11]/20 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <h1 className="text-white text-xl font-extrabold mb-6">Mon Profil</h1>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white overflow-hidden border-2 border-white/30 flex items-center justify-center font-bold text-[#FF4B11]">
              SARI
            </div>
            <div>
              <p className="text-white font-extrabold text-lg">Utilisateur SARI</p>
              <p className="text-white/80 text-sm">+221 {phone || '77 000 00 00'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-10 relative z-10 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-md grid grid-cols-3 divide-x divide-neutral-100">
          <div className="text-center">
            <p className="text-2xl font-extrabold text-[#FF4B11]">12</p>
            <p className="text-[11px] text-neutral-500 font-semibold mt-1">Commandes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-[#FF4B11]">4.8</p>
            <p className="text-[11px] text-neutral-500 font-semibold mt-1">Note moy.</p>
          </div>
          <button onClick={() => setScreen('favorites')} className="text-center active:scale-95">
            <p className="text-2xl font-extrabold text-[#87C025]">{favorites.length}</p>
            <p className="text-[11px] text-neutral-500 font-semibold mt-1">Favoris</p>
          </button>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-100">
            <p className="font-extrabold text-sm text-neutral-900 uppercase tracking-tight">Carnet d'adresses</p>
            <button
              onClick={() => setScreen('address-book')}
              className="text-xs font-extrabold text-[#FF4B11] bg-[#FDF6EC] px-3 py-1.5 rounded-lg active:scale-95"
            >
              AJOUTER
            </button>
          </div>

          {addresses.length === 0 && (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-neutral-400">Aucune adresse enregistrée</p>
            </div>
          )}

          {addresses.map((addr, i) => (
            <div key={addr.id} className={`flex items-center gap-3 px-4 py-3.5 ${i !== 0 ? 'border-t border-neutral-100' : ''}`}>
              <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0 font-bold text-[10px] text-neutral-400">
                {addr.label[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-neutral-900">{addr.label}</p>
                <p className="text-xs text-neutral-500 truncate">{addr.address}</p>
              </div>
              <button onClick={() => removeAddress(addr.id)} className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg active:scale-90">
                SUPPR.
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          {menuItems.map((item, i) => {
            const showBadge = item.badge !== undefined && item.badge > 0;
            return (
              <button
                key={item.label}
                onClick={item.action}
                className={`w-full flex items-center gap-4 px-4 py-5 active:bg-neutral-50 transition-colors ${i !== 0 ? 'border-t border-neutral-100' : ''}`}
              >
                <div className="flex-1 text-left">
                  <p className={`font-extrabold text-xs tracking-wider ${item.highlight ? 'text-[#FF4B11]' : 'text-neutral-900'}`}>{item.label}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
                </div>
                {showBadge && (
                  <span className="min-w-[22px] h-[22px] px-1.5 rounded-full bg-[#FF4B11] text-white text-[11px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
                <span className="text-neutral-300 text-lg">→</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-white rounded-2xl p-4 flex items-center justify-center gap-2 text-red-500 font-bold text-sm shadow-sm active:scale-[0.98]"
        >
          DÉCONNEXION
        </button>

        <p className="text-center text-xs text-neutral-400 pt-2">SARI FOOD v1.0 · Avril 2026</p>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfileScreen;
