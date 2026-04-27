import React, { useState } from 'react';
import { ArrowLeft, MapPin, Clock, ChevronRight, Menu as MenuIcon, BarChart3, ShoppingBag, AlertCircle, CheckCircle, Package, Truck, XCircle, Settings, Users } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { OWNER_BRANCHES, BRANCH_ORDERS, BranchOrder } from '@/data/managerData';
import { formatPrice } from '@/data/sariData';

const STATUS_CFG: Record<BranchOrder['status'], { label: string; color: string; bg: string; icon: any }> = {
  pending:    { label: 'En attente',    color: '#C94A2A', bg: '#FEF2F0', icon: AlertCircle },
  accepted:   { label: 'Acceptée',      color: '#7C3AED', bg: '#F5F3FF', icon: CheckCircle },
  preparing:  { label: 'En préparation', color: '#F4A012', bg: '#FFFBEB', icon: Clock },
  ready:      { label: 'Prête',         color: '#0F766E', bg: '#F0FDFA', icon: Package },
  delivering: { label: 'En livraison',  color: '#2563EB', bg: '#EFF6FF', icon: Truck },
  delivered:  { label: 'Livrée',        color: '#16a34a', bg: '#F0FDF4', icon: CheckCircle },
  refused:    { label: 'Refusée',       color: '#6b7280', bg: '#F9FAFB', icon: XCircle },
};

const STATUS_FLOW: BranchOrder['status'][] = [
  'pending', 'accepted', 'preparing', 'ready', 'delivering', 'delivered'
];

const PAYMENT: Record<string, string> = {
  wave: 'Wave', orange: 'Orange Money', free: 'Free Money', cash: 'Espèces',
};

const OwnerBranch: React.FC = () => {
  const { activeBranchId, setScreen, setSelectedOrderId } = useAppContext();
  const [activeTab, setActiveTab] = useState<'orders' | 'stats'>('orders');
  const [orders, setOrders] = useState<BranchOrder[]>(BRANCH_ORDERS);

  const branch = OWNER_BRANCHES.find(b => b.id === activeBranchId);
  if (!branch) { setScreen('owner-dashboard'); return null; }

  const branchOrders = orders.filter(o => o.branchId === activeBranchId);
  const liveOrders = branchOrders.filter(o => !['delivered', 'refused'].includes(o.status));
  const doneOrders = branchOrders.filter(o => ['delivered', 'refused'].includes(o.status));



  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => setScreen('owner-dashboard')}
            className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-700" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-extrabold text-neutral-900 truncate">{branch.name}</h1>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-[#7C3AED]" />
              <p className="text-xs text-neutral-500">{branch.neighborhood}, {branch.city}</p>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${
            branch.isOpen ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'
          }`}>
            {branch.isOpen ? 'Ouvert' : 'Fermé'}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-100">
          {[
            { id: 'orders', label: `Commandes (${liveOrders.length})`, icon: ShoppingBag },
            { id: 'stats',  label: 'Statistiques', icon: BarChart3 },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex-1 py-3 flex items-center justify-center gap-1.5 text-xs font-bold border-b-2 transition-all ${
                activeTab === t.id
                  ? 'border-[#7C3AED] text-[#7C3AED]'
                  : 'border-transparent text-neutral-400'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Orders tab ─────────────────────────────────────────────────── */}
      {activeTab === 'orders' && (
        <div className="px-5 pt-4 space-y-3">
          {liveOrders.length === 0 && doneOrders.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <p className="text-4xl mb-3">📭</p>
              <p className="font-bold text-neutral-900">Aucune commande</p>
              <p className="text-sm text-neutral-500 mt-1">Ce local n'a pas encore de commandes</p>
            </div>
          )}

          {/* Live orders */}
          {liveOrders.map(order => {
            const cfg = STATUS_CFG[order.status];
            const Icon = cfg.icon;
            const orderTotal = order.items.reduce((s, i) => s + i.qty * i.price, 0);
            return (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Status bar */}
                <div className="px-4 pt-4 pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: cfg.bg }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                      <span className="text-xs font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
                    </div>
                    <span className="text-xs text-neutral-400">{order.createdAt}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-extrabold text-sm text-neutral-900">{order.clientName}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">#{order.id} · {PAYMENT[order.paymentMethod]}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {order.deliveryMode === 'delivery' ? `🛵 ${order.address}` : '🏪 Retrait'}
                      </p>
                    </div>
                    <span className="font-extrabold text-[#7C3AED]">{formatPrice(orderTotal)}</span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2 border-t border-neutral-100 pt-2">
                    {order.items.map(i => `${i.qty}× ${i.name}`).join(', ')}
                  </p>
                </div>

                {/* Note: L'admin ne peut que consulter, pas modifier le statut ici */}
              </div>
            );
          })}

          {/* Done orders */}
          {doneOrders.length > 0 && (
            <>
              <h4 className="text-xs font-bold text-neutral-500 mt-2">Terminées</h4>
              {doneOrders.map(order => {
                const cfg = STATUS_CFG[order.status];
                const Icon = cfg.icon;
                const orderTotal = order.items.reduce((s, i) => s + i.qty * i.price, 0);
                return (
                  <div key={order.id} className="bg-white rounded-2xl shadow-sm p-4 opacity-70">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ backgroundColor: cfg.bg }}>
                        <Icon className="w-3 h-3" style={{ color: cfg.color }} />
                        <span className="text-xs font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
                      </div>
                      <span className="font-extrabold text-sm text-neutral-700">{formatPrice(orderTotal)}</span>
                    </div>
                    <p className="font-bold text-sm mt-2">{order.clientName} · #{order.id}</p>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}

      {/* ─── Stats tab ────────────────────────────────────────────────────── */}
      {activeTab === 'stats' && (
        <div className="px-5 pt-4 space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold text-sm mb-3">Performance</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Commandes aujourd'hui", value: branch.ordersToday },
                { label: 'Revenus du jour', value: formatPrice(branch.revenueToday), color: '#7C3AED' },
                { label: 'Commandes du mois', value: branch.ordersMonth },
                { label: 'Revenus du mois', value: formatPrice(branch.revenueMonth), color: '#7C3AED' },
              ].map((s, i) => (
                <div key={i} className="bg-neutral-50 rounded-xl p-3">
                  <p className="text-xs text-neutral-500">{s.label}</p>
                  <p className="font-extrabold text-sm mt-1" style={{ color: s.color || '#111827' }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold text-sm mb-3">Infos du local</h3>
            <div className="space-y-2.5">
              {[
                { label: 'Adresse', value: branch.address },
                { label: 'Horaires', value: `${branch.openTime} — ${branch.closeTime}` },
                { label: 'Frais de livraison', value: formatPrice(branch.deliveryFee) },
                { label: 'Zone de livraison', value: `${branch.deliveryRadius} km` },
                { label: 'Délai préparation', value: `~${branch.avgPrepTime} min` },
                { label: 'Téléphone', value: branch.phone },
                { label: 'Note clients', value: `⭐ ${branch.rating}` },
                { label: 'Ouvert depuis', value: branch.createdAt },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-start py-2 border-b border-neutral-50 last:border-0">
                  <span className="text-xs text-neutral-500">{r.label}</span>
                  <span className="text-xs font-bold text-neutral-900 text-right max-w-[55%]">{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setScreen('owner-create-branch')}
              className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FDF6EC] flex items-center justify-center">
                <Settings className="w-5 h-5 text-[#C94A2A]" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-sm">Modifier le local</p>
                <p className="text-xs text-neutral-500">Horaires, contacts, zones</p>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-300" />
            </button>
            <button
              onClick={() => setScreen('owner-menu')}
              className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] flex items-center justify-center">
                <MenuIcon className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-sm">Gérer le menu</p>
                <p className="text-xs text-neutral-500">Activer / désactiver les articles</p>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-300" />
            </button>
            <button
              onClick={() => setScreen('owner-gerants')}
              className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] flex items-center justify-center">
                <Users className="w-5 h-5 text-[#DC2626]" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-sm">Gérer les gérants</p>
                <p className="text-xs text-neutral-500">Ajouter / désactiver des gérants</p>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-300" />
            </button>
          </div>
        </div>
      )}

      <style>{`.line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }`}</style>
    </div>
  );
};

export default OwnerBranch;
