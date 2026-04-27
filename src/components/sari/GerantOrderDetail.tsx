import React, { useState } from 'react';
import {
  ArrowLeft, Phone, MapPin, Clock, CreditCard,
  CheckCircle, XCircle, ChefHat, Package, Truck, AlertTriangle
} from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { BRANCH_ORDERS as MANAGER_ORDERS, BranchOrder as ManagerOrder, BRANCH_LIVREURS } from '@/data/managerData';
import { formatPrice } from '@/data/sariData';

const STATUS_FLOW: ManagerOrder['status'][] = [
  'pending', 'accepted', 'preparing', 'ready', 'delivering', 'delivered'
];

const STATUS_CONFIG: Record<ManagerOrder['status'], {
  label: string; color: string; bg: string; icon: any; nextLabel?: string;
}> = {
  pending:    { label: 'En attente',    color: '#C94A2A', bg: '#FEF2F0', icon: Clock,         nextLabel: 'Accepter la commande' },
  accepted:   { label: 'Acceptée',      color: '#7C3AED', bg: '#F5F3FF', icon: CheckCircle,   nextLabel: 'Commencer la préparation' },
  preparing:  { label: 'En préparation', color: '#F4A012', bg: '#FFFBEB', icon: ChefHat,      nextLabel: 'Marquer comme prête' },
  ready:      { label: 'Prête',         color: '#0F766E', bg: '#F0FDFA', icon: Package,       nextLabel: 'Remettre au livreur' },
  delivering: { label: 'En livraison',  color: '#2563EB', bg: '#EFF6FF', icon: Truck,         nextLabel: 'Marquer comme livrée' },
  delivered:  { label: 'Livrée',        color: '#16a34a', bg: '#F0FDF4', icon: CheckCircle },
  refused:    { label: 'Refusée',       color: '#6b7280', bg: '#F9FAFB', icon: XCircle },
};

const PAYMENT_LABEL: Record<string, string> = {
  wave: 'Wave', orange: 'Orange Money', free: 'Free Money', cash: 'Espèces à la livraison',
};

const GerantOrderDetail: React.FC = () => {
  const { setScreen, selectedOrderId } = useAppContext();
  const [orders, setOrders] = useState<ManagerOrder[]>(MANAGER_ORDERS);
  const [showRefuse, setShowRefuse] = useState(false);
  const [showDriverSelect, setShowDriverSelect] = useState(false);
  const [motif, setMotif] = useState('');

  const order = orders.find(o => o.id === selectedOrderId);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <p className="text-neutral-500 mb-4">Commande introuvable</p>
          <button onClick={() => setScreen('gerant-dashboard')}
            className="bg-[#7C3AED] text-white px-6 py-3 rounded-xl font-bold">
            Retour
          </button>
        </div>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[order.status];
  const StatusIcon = cfg.icon;
  const currentIdx = STATUS_FLOW.indexOf(order.status);
  const orderTotal = order.items.reduce((s, i) => s + i.qty * i.price, 0);

  const advanceStatus = () => {
    if (currentIdx < STATUS_FLOW.length - 1) {
      if (order.status === 'ready' && order.deliveryMode === 'delivery') {
        setShowDriverSelect(true);
        return;
      }
      const next = STATUS_FLOW[currentIdx + 1];
      const newLog = { 
        action: `Statut changé: ${STATUS_CONFIG[next].label}`, 
        by: 'Gérant', 
        date: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
      };
      setOrders(prev => prev.map(o => o.id === order.id ? { 
        ...o, 
        status: next,
        logs: [...(o.logs || []), newLog]
      } : o));
    }
  };

  const refuseOrder = () => {
    const newLog = { action: `Commande refusée (${motif})`, by: 'Gérant', date: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'refused', logs: [...(o.logs || []), newLog] } : o));
    setShowRefuse(false);
  };

  const assignDriver = (livreurId: string) => {
    const livreur = BRANCH_LIVREURS.find(l => l.id === livreurId);
    const newLog = { 
      action: `Assignée au livreur: ${livreur?.name}`, 
      by: 'Gérant', 
      date: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
    };
    setOrders(prev => prev.map(o => o.id === order.id ? { 
      ...o, 
      status: 'delivering', 
      livreurId, 
      logs: [...(o.logs || []), newLog] 
    } : o));
    setShowDriverSelect(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-36">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 shadow-sm">
        <div className="px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => setScreen('gerant-dashboard')}
            className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-extrabold text-neutral-900">#{order.id}</h1>
            <p className="text-xs text-neutral-500">{order.createdAt}</p>
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ backgroundColor: cfg.bg }}
          >
            <StatusIcon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
            <span className="text-xs font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
          </div>
        </div>
      </div>

      <div className="px-5 pt-4 space-y-4">
        {/* Client info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-extrabold text-neutral-900 mb-3">Client</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-neutral-900">{order.clientName}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{order.clientPhone}</p>
            </div>
            <a
              href={`tel:${order.clientPhone}`}
              className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-md"
            >
              <Phone className="w-5 h-5 text-white" />
            </a>
          </div>
          {order.paymentMethod === 'cash' && (order.status === 'pending' || order.status === 'accepted') && (
            <a 
              href={`tel:${order.clientPhone}`} 
              className="mt-4 w-full bg-orange-50 text-orange-600 border border-orange-100 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Phone className="w-4 h-4" />
              Appeler pour confirmer (Paiement espèce)
            </a>
          )}
        </div>

        {/* Delivery info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-extrabold text-neutral-900 mb-3">
            {order.deliveryMode === 'delivery' ? '🛵 Livraison' : '🏪 Retrait en restaurant'}
          </h3>
          {order.deliveryMode === 'delivery' && (
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#C94A2A] mt-0.5 flex-shrink-0" />
              <p className="text-sm text-neutral-700 font-medium">{order.address}</p>
            </div>
          )}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-100">
            <CreditCard className="w-4 h-4 text-neutral-400" />
            <span className="text-sm text-neutral-600">{PAYMENT_LABEL[order.paymentMethod]}</span>
          </div>
        </div>

        {/* Order items */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-extrabold text-neutral-900 mb-3">Détail de la commande</h3>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FDF6EC] flex items-center justify-center">
                    <span className="font-extrabold text-sm text-[#C94A2A]">{item.qty}×</span>
                  </div>
                  <span className="text-sm font-semibold text-neutral-900">{item.name}</span>
                </div>
                <span className="font-bold text-neutral-700">{formatPrice(item.qty * item.price)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-neutral-100 mt-3 pt-3 flex justify-between">
            <span className="font-extrabold text-neutral-900">Total</span>
            <span className="font-extrabold text-lg text-[#7C3AED]">{formatPrice(orderTotal)}</span>
          </div>
        </div>

        {/* Status timeline */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-extrabold text-neutral-900 mb-4">Progression</h3>
          <div className="space-y-3">
            {STATUS_FLOW.map((s, i) => {
              const done = i < currentIdx;
              const active = i === currentIdx && order.status !== 'refused';
              const sCfg = STATUS_CONFIG[s];
              const SIcon = sCfg.icon;
              return (
                <div key={s} className="flex gap-3 relative">
                  {i < STATUS_FLOW.length - 1 && (
                    <div className={`absolute left-[15px] top-8 w-0.5 h-5 ${done ? 'bg-[#7C3AED]' : 'bg-neutral-200'}`} />
                  )}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    done ? 'bg-[#7C3AED]' : active ? 'bg-[#C94A2A] shadow-lg' : 'bg-neutral-200'
                  }`}>
                    {done
                      ? <CheckCircle className="w-4 h-4 text-white" />
                      : <SIcon className={`w-4 h-4 ${active ? 'text-white' : 'text-neutral-400'}`} />
                    }
                  </div>
                  <div className="flex-1 pb-1 flex items-center">
                    <p className={`font-bold text-sm ${
                      done ? 'text-[#7C3AED]' : active ? 'text-[#C94A2A]' : 'text-neutral-400'
                    }`}>
                      {sCfg.label}
                    </p>
                    {active && <span className="ml-2 w-2 h-2 rounded-full bg-[#C94A2A] animate-pulse" />}
                  </div>
                </div>
              );
            })}

            {order.status === 'refused' && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <XCircle className="w-4 h-4 text-gray-500" />
                </div>
                <p className="font-bold text-sm text-gray-500">Commande refusée</p>
              </div>
            )}
          </div>
        </div>

        {/* Historique des actions (Tracabilité) */}
        {order.logs && order.logs.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <h3 className="text-sm font-extrabold text-neutral-900 mb-3">Traçabilité</h3>
            <div className="space-y-3">
              {order.logs.map((log, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-neutral-300 flex-shrink-0" />
                  <div>
                    <p className="text-neutral-900 font-medium">{log.action}</p>
                    <p className="text-[11px] text-neutral-500">Par {log.by} à {log.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {order.status !== 'delivered' && order.status !== 'refused' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-5 py-4 z-20 space-y-2 max-w-md mx-auto">
          {/* Advance button */}
          <button
            onClick={advanceStatus}
            className="w-full bg-[#7C3AED] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#7C3AED]/30 active:scale-[0.98] transition-all"
          >
            {cfg.nextLabel || 'Étape suivante'}
          </button>

          {/* Refuse button (only for pending/accepted) */}
          {(order.status === 'pending' || order.status === 'accepted') && (
            <button
              onClick={() => setShowRefuse(true)}
              className="w-full bg-red-50 text-red-600 font-bold py-3 rounded-2xl border border-red-100 active:scale-[0.98]"
            >
              Refuser la commande
            </button>
          )}
        </div>
      )}

      {/* Refuse modal */}
      {showRefuse && (
        <div className="fixed inset-0 bg-black/50 z-30 flex items-end max-w-md mx-auto">
          <div className="bg-white rounded-t-3xl p-5 w-full animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-neutral-900">Refuser la commande</h3>
                <p className="text-xs text-neutral-500">Le client sera notifié du motif</p>
              </div>
            </div>

            {/* Quick-select chips */}
            <p className="text-xs font-bold text-neutral-500 uppercase mb-2">Sélectionner un motif</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                'Plus de stock',
                'Fermeture imminente',
                'Zone trop éloignée',
                'Restaurant surchargé',
                'Article indisponible',
              ].map(reason => (
                <button
                  key={reason}
                  onClick={() => setMotif(reason)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    motif === reason
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-red-50 text-red-600 border-red-100'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <textarea
              value={motif}
              onChange={e => setMotif(e.target.value)}
              placeholder="Ou saisissez un motif personnalisé..."
              rows={2}
              className="w-full bg-neutral-50 rounded-xl px-4 py-3 text-sm outline-none border border-neutral-200 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowRefuse(false)}
                className="flex-1 bg-neutral-100 text-neutral-700 font-bold py-3 rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={refuseOrder}
                disabled={motif.trim().length < 3}
                className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl disabled:opacity-40"
              >
                Confirmer le refus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Driver Selection Modal */}
      {showDriverSelect && (
        <div className="fixed inset-0 bg-black/50 z-30 flex items-end max-w-md mx-auto">
          <div className="bg-white rounded-t-3xl p-5 w-full animate-slide-up max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-neutral-900 text-lg">Affecter un livreur</h3>
                <p className="text-xs text-neutral-500">Sélectionnez le livreur pour cette course</p>
              </div>
              <button onClick={() => setShowDriverSelect(false)} className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
                <XCircle className="w-5 h-5 text-neutral-500" />
              </button>
            </div>
            
            <div className="space-y-3 mb-4">
              {BRANCH_LIVREURS.filter(l => l.branchId === order.branchId && l.isActive).map(livreur => (
                <button
                  key={livreur.id}
                  onClick={() => assignDriver(livreur.id)}
                  className="w-full flex items-center gap-4 bg-neutral-50 p-3 rounded-2xl active:bg-neutral-100 border border-transparent focus:border-[#7C3AED] text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900">{livreur.name}</p>
                    <p className="text-xs text-neutral-500">{livreur.phone} · {livreur.ordersDelivered} livraisons</p>
                  </div>
                </button>
              ))}
              {BRANCH_LIVREURS.filter(l => l.branchId === order.branchId && l.isActive).length === 0 && (
                <p className="text-center text-neutral-500 py-4 font-medium text-sm">
                  Aucun livreur disponible.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.25s ease-out; }
      `}</style>
    </div>
  );
};

export default GerantOrderDetail;
