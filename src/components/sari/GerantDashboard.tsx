import React, { useState, useEffect, useRef } from 'react';

import { useAppContext } from '@/contexts/AppContext';
import { BRANCH_ORDERS as MANAGER_ORDERS, MANAGER_STATS, BranchOrder as ManagerOrder, OWNER_BRANCHES } from '@/data/managerData';
import { formatPrice } from '@/data/sariData';
import { 
  Bell, 
  LogOut, 
  Volume2, 
  VolumeX, 
  ShoppingBag, 
  DollarSign, 
  Star, 
  Utensils, 
  Package, 
  Truck, 
  Settings, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Check, 
  XCircle, 
  Activity, 
  ChevronRight,
  MapPin,
  ClipboardList
} from 'lucide-react';

const STATUS_CONFIG: Record<ManagerOrder['status'], { label: string; color: string; bg: string; icon: any }> = {
  pending:    { label: 'En attente',     color: '#FF4B11', bg: '#FEF2F0', icon: AlertCircle },
  accepted:   { label: 'Acceptée',       color: '#87C025', bg: '#FDF6EC', icon: CheckCircle },
  preparing:  { label: 'En préparation', color: '#FF4B11', bg: '#FFFBEB', icon: Clock },
  ready:      { label: 'Prête',          color: '#FF4B11', bg: '#F0FDFA', icon: Check },
  delivering: { label: 'En livraison',   color: '#FF4B11', bg: '#FDF6EC', icon: Truck },
  delivered:  { label: 'Livrée',         color: '#87C025', bg: '#FDF6EC', icon: CheckCircle },
  refused:    { label: 'Refusée',        color: '#6b7280', bg: '#F9FAFB', icon: XCircle },
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
      <div className="bg-[#87C025] px-5 pt-10 pb-20 relative overflow-hidden">
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
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const next = !soundEnabled;
                  setSoundEnabled(next);
                  if (next) playBeep();
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all backdrop-blur-sm ${
                  soundEnabled ? 'bg-[#FF4B11]' : 'bg-white/20'
                }`}
                title={soundEnabled ? 'Son activé' : 'Activer le son'}
              >
                {soundEnabled ? <Volume2 className="w-5 h-5 text-white" /> : <VolumeX className="w-5 h-5 text-white" />}
              </button>

              {pendingCount > 0 && (
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF4B11] rounded-full text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#87C025]">
                    {pendingCount}
                  </span>
                </div>
              )}
              <button
                onClick={() => { setIsAuthenticated(false); setScreen('role-select'); }}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm active:scale-90 transition-transform"
              >
                <LogOut className="w-5 h-5 text-white" />
              </button>
            </div>
            </div>
          </div>

          {/* Sound alert banner */}
          {soundEnabled && pendingCount > 0 && (
            <div className="mb-4 bg-[#FF4B11]/20 border border-[#FF4B11]/40 rounded-xl px-3 py-2 flex items-center gap-2">
              
              <p className="text-[#FF4B11] text-xs font-bold">Alerte sonore active · {pendingCount} commande{pendingCount > 1 ? 's' : ''} en attente !</p>
            </div>
          )}

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: ShoppingBag, value: MANAGER_STATS.todayOrders, label: "Aujourd'hui", sub: 'commandes' },
              { icon: DollarSign,  value: formatPrice(MANAGER_STATS.todayRevenue), label: 'Revenus', sub: 'du jour' },
              { icon: Star,        value: MANAGER_STATS.rating, label: 'Note', sub: 'clients' },
            ].map((s, i) => (
              <div key={i} className="bg-white/15 rounded-2xl p-3 text-center border border-white/10 backdrop-blur-sm">
                <s.icon className="w-4 h-4 text-white/80 mx-auto mb-1" />
                <p className="text-white font-extrabold text-sm leading-none">{s.value}</p>
                <p className="text-white/60 text-[10px] mt-0.5 uppercase tracking-tighter font-bold">{s.sub}</p>
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
            activeTab === 'live' ? 'bg-white text-[#87C025]' : 'bg-white/70 text-neutral-500'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#FF4B11] animate-pulse" />
          En cours ({liveOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
            activeTab === 'history' ? 'bg-white text-[#87C025]' : 'bg-white/70 text-neutral-500'
          }`}
        >
          Historique ({historyOrders.length})
        </button>
      </div>

      {/* Action buttons */}
      <div className="px-5 mt-6 grid grid-cols-4 gap-3">
        <button onClick={() => setScreen('gerant-menu')}
          className="bg-white rounded-2xl p-3 shadow-sm flex flex-col items-center justify-center gap-2 active:scale-[0.98] transition-transform border border-neutral-100">
          <div className="w-10 h-10 rounded-xl bg-[#87C025]/10 flex items-center justify-center">
            <Utensils className="w-5 h-5 text-[#87C025]" />
          </div>
          <p className="font-bold text-[10px] uppercase tracking-tight text-neutral-900">Menu</p>
        </button>
        <button onClick={() => setScreen('gerant-inventory')}
          className="bg-white rounded-2xl p-3 shadow-sm flex flex-col items-center justify-center gap-2 active:scale-[0.98] transition-transform border border-neutral-100">
          <div className="w-10 h-10 rounded-xl bg-[#87C025]/10 flex items-center justify-center">
            <Package className="w-5 h-5 text-[#87C025]" />
          </div>
          <p className="font-bold text-[10px] uppercase tracking-tight text-neutral-900">Stocks</p>
        </button>
        <button onClick={() => setScreen('gerant-livreurs')}
          className="bg-white rounded-2xl p-3 shadow-sm flex flex-col items-center justify-center gap-2 active:scale-[0.98] transition-transform border border-neutral-100">
          <div className="w-10 h-10 rounded-xl bg-[#87C025]/10 flex items-center justify-center">
            <Truck className="w-5 h-5 text-[#87C025]" />
          </div>
          <p className="font-bold text-[10px] uppercase tracking-tight text-neutral-900">Livreurs</p>
        </button>
        <button onClick={() => setScreen('gerant-settings')}
          className="bg-white rounded-2xl p-3 shadow-sm flex flex-col items-center justify-center gap-2 active:scale-[0.98] transition-transform border border-neutral-100">
          <div className="w-10 h-10 rounded-xl bg-[#87C025]/10 flex items-center justify-center">
            <Settings className="w-5 h-5 text-[#87C025]" />
          </div>
          <p className="font-bold text-[10px] uppercase tracking-tight text-neutral-900">Paramètres</p>
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
                className="w-full bg-white rounded-3xl p-5 shadow-sm border border-neutral-100 text-left active:scale-[0.99] transition-all hover:shadow-md group"
              >
                {/* Status & ID */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ backgroundColor: cfg.bg }}>
                      <StatusIcon className="w-4 h-4" style={{ color: cfg.color }} />
                      <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: cfg.color }}>{cfg.label}</span>
                    </div>
                    {order.status === 'pending' && (
                      <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4B11] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF4B11]"></span>
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-neutral-300 uppercase tracking-widest">Commande #{order.id.slice(-5)}</p>
                    <p className="text-[10px] font-bold text-neutral-400 mt-0.5">{order.createdAt}</p>
                  </div>
                </div>

                {/* Client & Price */}
                <div className="flex items-end justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-base font-black text-neutral-900 leading-tight">{order.clientName}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3 h-3 text-neutral-400" />
                        <span className="text-[10px] font-extrabold text-neutral-500 uppercase">{PAYMENT_LABEL[order.paymentMethod]}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {order.deliveryMode === 'delivery' ? <Truck className="w-3 h-3 text-[#FF4B11]" /> : <MapPin className="w-3 h-3 text-[#87C025]" />}
                        <span className="text-[10px] font-extrabold text-neutral-500 uppercase">
                          {order.deliveryMode === 'delivery' ? 'Livraison' : 'Retrait'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#87C025]/5 px-4 py-2 rounded-2xl border border-[#87C025]/10">
                    <p className="text-lg font-black text-[#87C025]">{formatPrice(orderTotal)}</p>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="bg-neutral-50 rounded-2xl p-3 border border-neutral-100/50 flex items-center justify-between group-hover:bg-neutral-100/80 transition-colors">
                  <div className="flex-1">
                    <p className="text-[11px] font-bold text-neutral-600 line-clamp-1">
                      {order.items.map(i => `${i.qty}× ${i.name}`).join(', ')}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-[#87C025] transition-transform group-hover:translate-x-1" />
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
            <Activity className="w-4 h-4 text-[#87C025]" />
            <h4 className="font-extrabold text-sm text-neutral-900 uppercase tracking-tight">Performance semaine</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#FDF6EC] rounded-xl p-3">
              <p className="text-xs text-neutral-500">Commandes</p>
              <p className="text-xl font-extrabold text-[#87C025]">{MANAGER_STATS.weekOrders}</p>
            </div>
            <div className="bg-[#FDF6EC] rounded-xl p-3">
              <p className="text-xs text-neutral-500">Revenus semaine</p>
              <p className="text-base font-extrabold text-[#FF4B11]">{formatPrice(MANAGER_STATS.weekRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`.line-clamp-1{display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}`}</style>
    </div>
  );
};

export default GerantDashboard;





