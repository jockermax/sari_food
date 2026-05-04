import React, { useState } from 'react';

import { useAppContext } from '@/contexts/AppContext';
import { ADMIN_RESTAURANTS, ADMIN_STATS, AdminRestaurant } from '@/data/managerData';
import { formatPrice } from '@/data/sariData';
import { 
  Bell, 
  LogOut, 
  ShoppingBag, 
  DollarSign, 
  Store, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Star, 
  Activity, 
  BarChart3, 
  ChevronRight,
  Check,
  ArrowRight,
  ShieldCheck,
  Megaphone,
  Gift,
  Download,
  MapPin,
  Clock
} from 'lucide-react';

const STATUS_CFG: Record<AdminRestaurant['status'], { label: string; color: string; bg: string; icon: any }> = {
  active:    { label: 'Actif',      color: '#87C025', bg: '#FDF6EC', icon: CheckCircle },
  pending:   { label: 'En attente', color: '#FF4B11', bg: '#FFFBEB', icon: Clock },
  suspended: { label: 'Suspendu',   color: '#dc2626', bg: '#FEF2F2', icon: XCircle },
};

const TABS = ['Restaurants', 'Statistiques'] as const;
type Tab = typeof TABS[number];

const AdminDashboard: React.FC = () => {
  const { setScreen, setIsAuthenticated } = useAppContext();
  const [activeTab, setActiveTab] = useState<Tab>('Restaurants');
  const [filterStatus, setFilterStatus] = useState<AdminRestaurant['status'] | 'all'>('all');
  const [restaurants, setRestaurants] = useState<AdminRestaurant[]>(ADMIN_RESTAURANTS);

  const filtered = filterStatus === 'all'
    ? restaurants
    : restaurants.filter(r => r.status === filterStatus);

  const toggleStatus = (id: string, current: AdminRestaurant['status']) => {
    const next: AdminRestaurant['status'] = current === 'active' ? 'suspended' : 'active';
    setRestaurants(prev => prev.map(r => r.id === id ? { ...r, status: next } : r));
  };

  const validatePending = (id: string) => {
    setRestaurants(prev => prev.map(r => r.id === id ? { ...r, status: 'active' } : r));
  };

  const pendingCount = restaurants.filter(r => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <div className="bg-[#FF4B11] px-5 pt-10 pb-20 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-36 h-36 rounded-full bg-white/10" />
        <div className="absolute bottom-2 left-10 w-20 h-20 rounded-full bg-white/5" />
        <div className="relative">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">Administration</p>
              <h1 className="text-white text-xl font-extrabold mt-0.5">Tableau de bord SARI</h1>
              <p className="text-white/70 text-xs mt-0.5">Vue globale de la plateforme</p>
            </div>
            <div className="flex gap-2">
              {pendingCount > 0 && (
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF4B11] rounded-full text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#FF4B11]">
                    {pendingCount}
                  </span>
                </div>
              )}
              <button
                onClick={() => { setIsAuthenticated(false); setScreen('role-select'); }}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm active:scale-95 transition-transform"
              >
                <LogOut className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Top stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Ventes/Jour", value: ADMIN_STATS.totalOrdersToday, icon: ShoppingBag },
              { label: 'Revenus', value: formatPrice(ADMIN_STATS.revenueToday), icon: DollarSign },
              { label: 'Restaurants', value: `${ADMIN_STATS.activeRestaurants}/${ADMIN_STATS.totalRestaurants}`, icon: Store },
              { label: 'Clients', value: ADMIN_STATS.activeUsersToday, icon: Users },
            ].map((s, i) => (
              <div key={i} className="bg-white/15 rounded-2xl p-3 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <s.icon className="w-3.5 h-3.5 text-white/60" />
                  <p className="text-white font-extrabold text-base leading-none">{s.value}</p>
                </div>
                <p className="text-white/60 text-[10px] uppercase tracking-tighter font-bold">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 -mt-6 relative z-10 flex gap-3">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 rounded-2xl font-bold text-sm shadow-md transition-all ${
              activeTab === tab ? 'bg-white text-[#FF4B11]' : 'bg-white/70 text-neutral-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Restaurants' && (
        <>
          {/* Filter chips */}
          <div className="px-5 mt-4 flex gap-2 overflow-x-auto scrollbar-hide">
            {(['all', 'active', 'pending', 'suspended'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  filterStatus === s ? 'bg-[#FF4B11] text-white shadow-md' : 'bg-white text-neutral-600 shadow-sm'
                }`}
              >
                {s === 'all' ? 'Tous' : STATUS_CFG[s].label}
                {s !== 'all' && (
                  <span className="ml-1 opacity-70">
                    ({restaurants.filter(r => r.status === s).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Pending validation alert */}
          {pendingCount > 0 && (
            <div className="mx-5 mt-4 bg-[#FFFBEB] border border-[#FF4B11]/30 rounded-2xl p-4 flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#FF4B11]" />
              <p className="text-sm font-bold text-neutral-800 flex-1">
                {pendingCount} établissement{pendingCount > 1 ? 's' : ''} en attente de validation
              </p>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>
          )}

          {/* Restaurant list */}
          <div className="px-5 mt-4 space-y-3">
            {filtered.map(r => {
              const sCfg = STATUS_CFG[r.status];
              const SIcon = sCfg.icon;
              return (
                <div key={r.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {/* Restaurant info */}
                  <div className="p-4 flex items-center gap-3">
                    <img
                      src={r.image}
                      alt={r.name}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm text-neutral-900 truncate">{r.name}</h3>
                        <div className="flex items-center gap-1 flex-shrink-0 px-2 py-0.5 rounded-full" style={{ backgroundColor: sCfg.bg }}>
                          <SIcon className="w-2.5 h-2.5" style={{ color: sCfg.color }} />
                          <span className="text-[10px] font-bold" style={{ color: sCfg.color }}>{sCfg.label}</span>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">{r.owner}</p>
                      <p className="text-xs text-neutral-400">{r.neighborhood}, {r.city} · Depuis {r.joinDate}</p>
                    </div>
                  </div>

                  {/* Stats row */}
                  {r.status !== 'pending' && (
                    <div className="border-t border-neutral-100 px-4 py-3 flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="text-xs font-bold text-neutral-700">{r.ordersToday} cmd/jour</span>
                      </div>
                      {r.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs font-bold text-neutral-700">{r.rating}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="border-t border-neutral-100 px-4 py-3 flex gap-2">
                    {r.status === 'pending' ? (
                      <button
                        onClick={() => validatePending(r.id)}
                        className="flex-1 bg-[#87C025] text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-[#87C025]/30 active:scale-95 transition-transform"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Valider l'inscription
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleStatus(r.id, r.status)}
                        className={`flex-1 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 ${
                          r.status === 'active'
                            ? 'bg-red-50 text-red-600 border border-red-100'
                            : 'bg-green-50 text-green-700 border border-green-100'
                        }`}
                      >
                        {r.status === 'active'
                          ? <> Suspendre</>
                          : <> Réactiver</>
                        }
                      </button>
                    )}
                    <button className="px-4 py-2.5 bg-neutral-100 text-neutral-600 font-extrabold text-[10px] uppercase tracking-widest rounded-xl flex items-center gap-1 active:scale-95 transition-transform">
                      Détails 
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === 'Statistiques' && (
        <div className="px-5 mt-5 space-y-4">
          {/* Commission card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-[#FF4B11]" />
              <h4 className="font-extrabold text-sm text-neutral-900 uppercase tracking-tight">Revenus & Commissions</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Revenus du jour', value: formatPrice(ADMIN_STATS.revenueToday), color: '#FF4B11' },
                { label: 'Commission (8%)', value: formatPrice(ADMIN_STATS.commissionToday), color: '#87C025' },
                { label: 'Revenus du mois', value: formatPrice(ADMIN_STATS.revenueMonth), color: '#FF4B11' },
                { label: 'Commission mois', value: formatPrice(ADMIN_STATS.commissionMonth), color: '#87C025' },
              ].map((s, i) => (
                <div key={i} className="bg-neutral-50 rounded-xl p-3">
                  <p className="text-xs text-neutral-500 mb-1">{s.label}</p>
                  <p className="font-extrabold text-sm" style={{ color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Platform stats */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-[#87C025]" />
              <h4 className="font-extrabold text-sm text-neutral-900 uppercase tracking-tight">Plateforme</h4>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Total utilisateurs inscrits', value: ADMIN_STATS.totalUsers.toLocaleString('fr-FR') },
                { label: 'Utilisateurs actifs (aujourd\'hui)', value: ADMIN_STATS.activeUsersToday },
                { label: 'Restaurants enregistrés', value: ADMIN_STATS.totalRestaurants },
                { label: 'Restaurants actifs', value: ADMIN_STATS.activeRestaurants },
                { label: 'En attente de validation', value: ADMIN_STATS.pendingValidation, warn: true },
                { label: 'Délai moyen de livraison', value: `${ADMIN_STATS.avgDeliveryTime} min` },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                  <span className="text-sm text-neutral-600">{s.label}</span>
                  <span className={`font-extrabold text-sm ${s.warn ? 'text-[#FF4B11]' : 'text-neutral-900'}`}>
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h4 className="font-bold text-sm mb-3">Actions rapides</h4>
            <div className="space-y-2">
              {[
                { label: '📢 Envoyer une notification globale', desc: 'Cibler tous les utilisateurs' },
                { label: '🎁 Créer un code promo', desc: 'Réduction globale ou ciblée' },
                { label: '📊 Exporter les rapports', desc: 'CSV, Excel, PDF' },
                { label: '⚙️ Gérer les villes actives', desc: 'Ajouter / retirer des zones' },
              ].map((a, i) => (
                <button key={i} className="w-full flex items-center justify-between py-3.5 px-4 rounded-2xl hover:bg-neutral-50 active:bg-neutral-100 transition-colors text-left border border-neutral-50 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center group-hover:bg-white transition-colors">
                      {i === 0 && <Megaphone className="w-5 h-5 text-neutral-600" />}
                      {i === 1 && <Gift className="w-5 h-5 text-neutral-600" />}
                      {i === 2 && <Download className="w-5 h-5 text-neutral-600" />}
                      {i === 3 && <MapPin className="w-5 h-5 text-neutral-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-neutral-900">{a.label}</p>
                      <p className="text-[11px] text-neutral-400 font-medium">{a.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-[#FF4B11] transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  );
};

export default AdminDashboard;





