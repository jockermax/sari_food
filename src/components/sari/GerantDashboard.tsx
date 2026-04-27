import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart3, ShoppingBag, Clock, Star, Bell, BellOff, ChevronRight,
  TrendingUp, Package, CheckCircle, AlertCircle, Truck, LogOut,
  Menu as MenuIcon, Settings, Volume2, VolumeX
} from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { BRANCH_ORDERS as MANAGER_ORDERS, MANAGER_STATS, BranchOrder as ManagerOrder, OWNER_BRANCHES } from '@/data/managerData';
import { formatPrice } from '@/data/sariData';

const STATUS_CONFIG: Record<ManagerOrder['status'], { label: string; color: string; bg: string; icon: any }> = {
  pending:    { label: 'En attente',     color: '#C94A2A', bg: '#FEF2F0', icon: AlertCircle },
  accepted:   { label: 'Acceptée',       color: '#7C3AED', bg: '#F5F3FF', icon: CheckCircle },
  preparing:  { label: 'En préparation', color: '#F4A012', bg: '#FFFBEB', icon: Clock },
  ready:      { label: 'Prête',          color: '#0F766E', bg: '#F0FDFA', icon: Package },
  delivering: { label: 'En livraison',   color: '#2563EB', bg: '#EFF6FF', icon: Truck },
  delivered:  { label: 'Livrée',         color: '#16a34a', bg: '#F0FDF4', icon: CheckCircle },
  refused:    { label: 'Refusée',        color: '#6b7280', bg: '#F9FAFB', icon: AlertCircle },
};

const PAYMENT_LABEL: Record<string, string> = {
  wave: 'Wave', orange: 'Orange Money', free: 'Free Money', cash: 'Espèces',
};

/** Plays a short beep using Web Audio API */
const playBeep = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
    // Second beep
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2); gain2.connect(ctx.destination);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1100, ctx.currentTime + 0.45);
    gain2.gain.setValueAtTime(0.6, ctx.currentTime + 0.45);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.85);
    osc2.start(ctx.currentTime + 0.45);
    osc2.stop(ctx.currentTime + 0.85);
  } catch {}
};

const GerantDashboard: React.FC = () => {
  const { setScreen, setSelectedOrderId, setIsAuthenticated, activeBranchId } = useAppContext();
  const [activeTab, setActiveTab] = useState<'live' | 'history'>('live');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const prevPendingRef = useRef(0);

  const branchId = activeBranchId || 'b1';
  const branch = OWNER_BRANCHES.find(b => b.id === branchId) || OWNER_BRANCHES[0];
  const myOrders = MANAGER_ORDERS.filter(o => o.branchId === branch.id);

  const liveOrders    = myOrders.filter(o => ['pending', 'accepted', 'preparing', 'ready', 'delivering'].includes(o.status));
  const historyOrders = myOrders.filter(o => ['delivered', 'refused'].includes(o.status));
  const pendingCount  = myOrders.filter(o => o.status === 'pending').length;

  // Sound alert when new "pending" orders appear
  useEffect(() => {
    if (soundEnabled && pendingCount > prevPendingRef.current) {
      playBeep();
    }
    prevPendingRef.current = pendingCount;
  }, [pendingCount, soundEnabled]);

  const handleOrderClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setScreen('gerant-order-detail');
  };


  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <div className="bg-[#7C3AED] px-5 pt-10 pb-20 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute bottom-0 left-8 w-24 h-24 rounded-full bg-white/5" />
        <div className="relative">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">Espace Gérant</p>
              <h1 className="text-white text-xl font-extrabold mt-0.5">{branch.name}</h1>
              <p className="text-white/70 text-xs mt-0.5">{branch.neighborhood}, {branch.city}</p>
            </div>
            <div className="flex gap-2">
              {/* 🔔 Sound toggle */}
              <button
                onClick={() => {
                  const next = !soundEnabled;
                  setSoundEnabled(next);
                  if (next) playBeep(); // preview the sound on enable
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  soundEnabled ? 'bg-[#F4A012]' : 'bg-white/20'
                }`}
                title={soundEnabled ? 'Son activé' : 'Activer le son'}
              >
                {soundEnabled
                  ? <Volume2 className="w-5 h-5 text-white" />
                  : <VolumeX className="w-5 h-5 text-white" />
                }
              </button>

              {pendingCount > 0 && (
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C94A2A] rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                    {pendingCount}
                  </span>
                </div>
              )}
              <button
                onClick={() => { setIsAuthenticated(false); setScreen('role-select'); }}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
              >
                <LogOut className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Sound alert banner */}
          {soundEnabled && pendingCount > 0 && (
            <div className="mb-4 bg-[#F4A012]/20 border border-[#F4A012]/40 rounded-xl px-3 py-2 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#F4A012] flex-shrink-0" />
              <p className="text-[#F4A012] text-xs font-bold">Alerte sonore active · {pendingCount} commande{pendingCount > 1 ? 's' : ''} en attente !</p>
            </div>
          )}

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: ShoppingBag, value: MANAGER_STATS.todayOrders, label: "Aujourd'hui", sub: 'commandes' },
              { icon: TrendingUp,  value: formatPrice(MANAGER_STATS.todayRevenue), label: 'Revenus', sub: 'du jour' },
              { icon: Star,        value: MANAGER_STATS.rating, label: 'Note', sub: 'clients' },
            ].map((s, i) => (
              <div key={i} className="bg-white/15 rounded-2xl p-3 text-center">
                <s.icon className="w-4 h-4 text-white/80 mx-auto mb-1" />
                <p className="text-white font-extrabold text-sm leading-none">{s.value}</p>
                <p className="text-white/60 text-[10px] mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nav pills */}
      <div className="px-5 -mt-6 relative z-10 flex gap-3">
        <button
          onClick={() => setActiveTab('live')}
          className={`flex-1 py-3 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
            activeTab === 'live' ? 'bg-white text-[#7C3AED]' : 'bg-white/70 text-neutral-500'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#C94A2A] animate-pulse" />
          En cours ({liveOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
            activeTab === 'history' ? 'bg-white text-[#7C3AED]' : 'bg-white/70 text-neutral-500'
          }`}
        >
          Historique ({historyOrders.length})
        </button>
      </div>

      {/* Action buttons */}
      <div className="px-5 mt-6 grid grid-cols-4 gap-3">
        <button onClick={() => setScreen('gerant-menu')}
          className="bg-white rounded-2xl p-3 shadow-sm flex flex-col items-center justify-center gap-2 active:scale-[0.98]">
          <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] flex items-center justify-center">
            <MenuIcon className="w-5 h-5 text-[#7C3AED]" />
          </div>
          <p className="font-bold text-xs text-neutral-900">Menu</p>
        </button>
        <button onClick={() => setScreen('gerant-inventory')}
          className="bg-white rounded-2xl p-3 shadow-sm flex flex-col items-center justify-center gap-2 active:scale-[0.98]">
          <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-[#16A34A]" />
          </div>
          <p className="font-bold text-xs text-neutral-900">Stocks</p>
        </button>
        <button onClick={() => setScreen('gerant-livreurs')}
          className="bg-white rounded-2xl p-3 shadow-sm flex flex-col items-center justify-center gap-2 active:scale-[0.98]">
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
            <Truck className="w-5 h-5 text-[#2563EB]" />
          </div>
          <p className="font-bold text-xs text-neutral-900">Livreurs</p>
        </button>
        <button onClick={() => setScreen('gerant-settings')}
          className="bg-white rounded-2xl p-3 shadow-sm flex flex-col items-center justify-center gap-2 active:scale-[0.98]">
          <div className="w-10 h-10 rounded-xl bg-[#FDF6EC] flex items-center justify-center">
            <Settings className="w-5 h-5 text-[#C94A2A]" />
          </div>
          <p className="font-bold text-xs text-neutral-900">Paramètres</p>
        </button>
      </div>


      {/* Orders list */}
      <div className="px-5 mt-5">
        <h3 className="text-sm font-extrabold text-neutral-900 mb-3">
          {activeTab === 'live' ? 'Commandes en cours' : 'Commandes terminées'}
        </h3>

        <div className="space-y-3">
          {(activeTab === 'live' ? liveOrders : historyOrders).map(order => {
            const cfg = STATUS_CONFIG[order.status];
            const StatusIcon = cfg.icon;
            const orderTotal = order.items.reduce((s, i) => s + i.qty * i.price, 0);
            return (
              <button
                key={order.id}
                onClick={() => handleOrderClick(order.id)}
                className="w-full bg-white rounded-2xl p-4 shadow-sm text-left active:scale-[0.99] transition-transform"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: cfg.bg }}>
                      <StatusIcon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                      <span className="text-xs font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
                    </div>
                    {order.status === 'pending' && (
                      <span className="w-2 h-2 rounded-full bg-[#C94A2A] animate-pulse" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-400">{order.createdAt}</span>
                    <ChevronRight className="w-4 h-4 text-neutral-300" />
                  </div>
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-extrabold text-neutral-900 text-sm">{order.clientName}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      #{order.id} · {order.items.length} article(s) · {PAYMENT_LABEL[order.paymentMethod]}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {order.deliveryMode === 'delivery' ? '🛵 Livraison' : '🏪 Retrait'}
                    </p>
                  </div>
                  <span className="font-extrabold text-[#7C3AED]">{formatPrice(orderTotal)}</span>
                </div>

                <div className="mt-3 pt-3 border-t border-neutral-100">
                  <p className="text-xs text-neutral-500 line-clamp-1">
                    {order.items.map(i => `${i.qty}× ${i.name}`).join(', ')}
                  </p>
                </div>
              </button>
            );
          })}

          {(activeTab === 'live' ? liveOrders : historyOrders).length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center">
              <p className="text-4xl mb-3">📭</p>
              <p className="font-bold text-neutral-900">Aucune commande</p>
              <p className="text-sm text-neutral-500 mt-1">
                {activeTab === 'live' ? 'Pas de commande en cours' : 'Aucune commande terminée'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Weekly stats */}
      <div className="px-5 mt-5">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-[#7C3AED]" />
            <h4 className="font-bold text-sm">Performance semaine</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F5F3FF] rounded-xl p-3">
              <p className="text-xs text-neutral-500">Commandes</p>
              <p className="text-xl font-extrabold text-[#7C3AED]">{MANAGER_STATS.weekOrders}</p>
            </div>
            <div className="bg-[#FDF6EC] rounded-xl p-3">
              <p className="text-xs text-neutral-500">Revenus semaine</p>
              <p className="text-base font-extrabold text-[#C94A2A]">{formatPrice(MANAGER_STATS.weekRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`.line-clamp-1{display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}`}</style>
    </div>
  );
};

export default GerantDashboard;
