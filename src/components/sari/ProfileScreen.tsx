import React, { useState } from 'react';
import { MapPin, CreditCard, Bell, Heart, HelpCircle, LogOut, ChevronRight, Gift, RefreshCw, Plus, X, Home, Briefcase, Star } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import BottomNav from './BottomNav';
import { LOGO_URL } from '@/data/sariData';

interface SavedAddress {
  id: string;
  label: string;
  address: string;
  icon: 'home' | 'work' | 'other';
}

const ICON_MAP = { home: Home, work: Briefcase, other: MapPin };
const ICON_COLOR = { home: '#C94A2A', work: '#2563EB', other: '#7C3AED' };
const ICON_BG   = { home: '#FDF6EC', work: '#EFF6FF', other: '#F5F3FF' };

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

  const menuItems: Array<{ Icon: any; label: string; desc: string; action: () => void; badge?: number; highlight?: boolean }> = [
    { Icon: CreditCard, label: 'Moyens de paiement', desc: 'Wave, Orange Money...', action: () => {} },
    {
      Icon: Heart, label: 'Mes favoris',
      desc: favorites.length > 0 ? `${favorites.length} restaurant${favorites.length > 1 ? 's' : ''} sauvegardé${favorites.length > 1 ? 's' : ''}` : "Aucun favori pour l'instant",
      action: () => setScreen('favorites'), badge: favorites.length, highlight: favorites.length > 0,
    },
    { Icon: Gift,       label: 'Parrainage',       desc: 'Invitez et gagnez 2 000 FCFA', action: () => {} },
    { Icon: Bell,       label: 'Notifications',     desc: 'Gérer les alertes',              action: () => {} },
    { Icon: HelpCircle, label: 'Aide & Support',    desc: 'FAQ, nous contacter',             action: () => {} },
    { Icon: RefreshCw,  label: 'Changer de rôle',   desc: 'Démo : Propriétaire',             action: () => setScreen('role-select') },
  ];

  return (
    <div className="min-h-screen bg-[#FDF6EC] pb-24">
      {/* Header */}
      <div className="bg-[#C94A2A] px-5 pt-8 pb-16 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#F4A012]/20 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <h1 className="text-white text-xl font-extrabold mb-6">Mon Profil</h1>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white overflow-hidden border-2 border-white/30">
              <img src={LOGO_URL} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-white font-extrabold text-lg">Utilisateur SARI</p>
              <p className="text-white/80 text-sm">+221 {phone || '77 000 00 00'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-10 relative z-10 space-y-4">
        {/* Stats */}
        <div className="bg-white rounded-2xl p-4 shadow-md grid grid-cols-3 divide-x divide-neutral-100">
          <div className="text-center">
            <p className="text-2xl font-extrabold text-[#C94A2A]">12</p>
            <p className="text-[11px] text-neutral-500 font-semibold mt-1">Commandes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-[#F4A012]">4.8</p>
            <p className="text-[11px] text-neutral-500 font-semibold mt-1">Note moy.</p>
          </div>
          <button onClick={() => setScreen('favorites')} className="text-center active:scale-95">
            <p className="text-2xl font-extrabold text-green-600">{favorites.length}</p>
            <p className="text-[11px] text-neutral-500 font-semibold mt-1">Favoris</p>
          </button>
        </div>

        {/* ── Address Book ─────────────────────────────── */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FDF6EC] flex items-center justify-center">
                <MapPin className="w-4 h-4 text-[#C94A2A]" />
              </div>
              <p className="font-extrabold text-sm text-neutral-900">Carnet d'adresses</p>
            </div>
            <button
              onClick={() => setScreen('address-book')}
              className="flex items-center gap-1 text-xs font-bold text-[#C94A2A] bg-[#FDF6EC] px-3 py-1.5 rounded-lg active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              Ajouter
            </button>
          </div>

          {addresses.length === 0 && (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-neutral-400">Aucune adresse enregistrée</p>
            </div>
          )}

          {addresses.map((addr, i) => {
            const AddrIcon = ICON_MAP[addr.icon];
            return (
              <div key={addr.id} className={`flex items-center gap-3 px-4 py-3.5 ${i !== 0 ? 'border-t border-neutral-100' : ''}`}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: ICON_BG[addr.icon] }}>
                  <AddrIcon className="w-4 h-4" style={{ color: ICON_COLOR[addr.icon] }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-neutral-900">{addr.label}</p>
                  <p className="text-xs text-neutral-500 truncate">{addr.address}</p>
                </div>
                <button onClick={() => removeAddress(addr.id)} className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center active:scale-90">
                  <X className="w-3.5 h-3.5 text-neutral-400" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Menu items */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          {menuItems.map((item, i) => {
            const Icon = item.Icon;
            const showBadge = item.badge !== undefined && item.badge > 0;
            return (
              <button
                key={item.label}
                onClick={item.action}
                className={`w-full flex items-center gap-3 px-4 py-4 active:bg-neutral-50 transition-colors ${i !== 0 ? 'border-t border-neutral-100' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.highlight ? 'bg-[#C94A2A]' : 'bg-[#FDF6EC]'}`}>
                  <Icon className={`w-5 h-5 ${item.highlight ? 'text-white' : 'text-[#C94A2A]'}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-sm text-neutral-900">{item.label}</p>
                  <p className="text-xs text-neutral-500">{item.desc}</p>
                </div>
                {showBadge && (
                  <span className="min-w-[22px] h-[22px] px-1.5 rounded-full bg-[#C94A2A] text-white text-[11px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-5 h-5 text-neutral-300" />
              </button>
            );
          })}
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-white rounded-2xl p-4 flex items-center justify-center gap-2 text-red-500 font-bold text-sm shadow-sm active:scale-[0.98]"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>

        <p className="text-center text-xs text-neutral-400 pt-2">SARI FOOD v1.0 · Avril 2026</p>
      </div>


      {/* ── Add Address Modal ────────────────────────── */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end max-w-md mx-auto">
          <div className="bg-white rounded-t-3xl w-full p-5" style={{ animation: 'slideUp 0.25s ease-out' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-extrabold text-neutral-900 text-lg">Nouvelle adresse</h3>
              <button onClick={() => setShowAddressModal(false)} className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
                <X className="w-4 h-4 text-neutral-500" />
              </button>
            </div>

            {/* Type selector */}
            <p className="text-xs font-bold text-neutral-500 uppercase mb-2">Type d'adresse</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {(['home', 'work', 'other'] as const).map(type => {
                const TIcon = ICON_MAP[type];
                const labels = { home: 'Maison', work: 'Bureau', other: 'Autre' };
                return (
                  <button
                    key={type}
                    onClick={() => { setNewIcon(type); setNewLabel(labels[type]); }}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all ${newIcon === type ? 'border-[#C94A2A] bg-[#FDF6EC]' : 'border-neutral-200 bg-neutral-50'}`}
                  >
                    <TIcon className="w-5 h-5" style={{ color: newIcon === type ? ICON_COLOR[type] : '#9ca3af' }} />
                    <span className={`text-xs font-bold ${newIcon === type ? 'text-[#C94A2A]' : 'text-neutral-500'}`}>{labels[type]}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase mb-1 block">Libellé</label>
                <input
                  value={newLabel}
                  onChange={e => setNewLabel(e.target.value)}
                  placeholder="ex: Maison, Bureau..."
                  className="w-full bg-neutral-50 rounded-xl px-4 py-3 text-sm outline-none border border-neutral-200 focus:border-[#C94A2A]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase mb-1 block">Adresse complète</label>
                <input
                  value={newAddress}
                  onChange={e => setNewAddress(e.target.value)}
                  placeholder="Rue, Quartier, Ville..."
                  className="w-full bg-neutral-50 rounded-xl px-4 py-3 text-sm outline-none border border-neutral-200 focus:border-[#C94A2A]"
                />
              </div>
            </div>

            <button
              onClick={addAddress}
              disabled={!newLabel.trim() || !newAddress.trim()}
              className="w-full bg-[#C94A2A] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#C94A2A]/30 disabled:opacity-40 active:scale-[0.98] transition-all"
            >
              Enregistrer l'adresse
            </button>
          </div>
        </div>
      )}
      <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
    </div>
  );
};

export default ProfileScreen;
