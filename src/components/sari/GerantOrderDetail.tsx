import React, { useState } from 'react';

import { useAppContext } from '@/contexts/AppContext';
import { BRANCH_ORDERS as MANAGER_ORDERS, BranchOrder as ManagerOrder, BRANCH_LIVREURS } from '@/data/managerData';
import { formatPrice } from '@/data/sariData';
import { 
  ArrowLeft, 
  Phone, 
  MapPin, 
  CreditCard, 
  DollarSign, 
  Clock, 
  AlertTriangle, 
  X, 
  Bike, 
  CheckCircle, 
  Truck, 
  Check, 
  XCircle, 
  AlertCircle,
  ChevronRight,
  User,
  History,
  ClipboardList,
  MessageCircle,
  ShieldCheck,
  Star
} from 'lucide-react';

const STATUS_FLOW: ManagerOrder['status'][] = [
  'pending', 'accepted', 'preparing', 'ready', 'delivering', 'delivered'
];

const STATUS_CONFIG: Record<ManagerOrder['status'], {
  label: string; color: string; bg: string; icon: any; nextLabel?: string }> = {
  pending:    { label: 'En attente',    color: '#FF4B11', bg: '#FEF2F0', icon: AlertCircle, nextLabel: 'Accepter la commande' },
  accepted:   { label: 'Acceptée',      color: '#87C025', bg: '#FDF6EC', icon: CheckCircle, nextLabel: 'Commencer la préparation' },
  preparing:  { label: 'En préparation', color: '#FF4B11', bg: '#FFFBEB', icon: Clock, nextLabel: 'Marquer comme prête' },
  ready:      { label: 'Prête',         color: '#FF4B11', bg: '#F0FDFA', icon: Check, nextLabel: 'Remettre au livreur' },
  delivering: { label: 'En livraison',  color: '#FF4B11', bg: '#FDF6EC', icon: Truck, nextLabel: 'Marquer comme livrée' },
  delivered:  { label: 'Livrée',        color: '#87C025', bg: '#FDF6EC', icon: CheckCircle },
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
            className="bg-[#87C025] text-white px-6 py-3 rounded-xl font-bold">
            Retour
          </button>
        </div>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[order.status];
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
      <div className="bg-white sticky top-0 z-20 border-b border-neutral-100 shadow-sm">
        <div className="px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => setScreen('gerant-dashboard')}
            className="w-11 h-11 rounded-2xl bg-neutral-100 flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-900" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-black text-neutral-900 uppercase tracking-tighter">Commande #{order.id.slice(-6)}</h1>
            <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">{order.createdAt}</p>
          </div>
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-2xl"
            style={{ backgroundColor: cfg.bg }}
          >
            <cfg.icon className="w-4 h-4" style={{ color: cfg.color }} />
            <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: cfg.color }}>{cfg.label}</span>
          </div>
        </div>
      </div>

      <div className="px-5 pt-4 space-y-4">
        {/* Client info */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-neutral-100 relative overflow-hidden group">
          {/* Decorative background element */}
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#87C025]/5 rounded-full blur-2xl group-hover:bg-[#87C025]/10 transition-colors" />
          
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-neutral-50 flex items-center justify-center">
                <User className="w-4 h-4 text-neutral-400" />
              </div>
              <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Informations Client</h3>
            </div>
            <div className="flex items-center gap-1 bg-[#87C025]/10 px-2.5 py-1 rounded-full">
              <Star className="w-3 h-3 text-[#87C025] fill-[#87C025]" />
              <span className="text-[9px] font-black text-[#87C025] uppercase tracking-tighter">Client Fidèle</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-[#87C025] to-[#76a820] flex items-center justify-center shadow-lg shadow-[#87C025]/20">
                  <span className="text-2xl font-black text-white">{order.clientName.charAt(0)}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-lg shadow-md flex items-center justify-center border border-neutral-50">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#87C025]" />
                </div>
              </div>
              <div>
                <p className="font-black text-neutral-900 text-lg leading-none mb-1">{order.clientName}</p>
                <p className="text-xs font-extrabold text-neutral-400 tracking-tight flex items-center gap-1.5">
                  <Phone className="w-3 h-3" />
                  {order.clientPhone}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <a
                href={`https://wa.me/${order.clientPhone.replace(/\s/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 rounded-2xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all active:scale-90 shadow-sm"
                title="WhatsApp"
              >
                <MessageCircle className="w-6 h-6 fill-current" />
              </a>
              <a
                href={`tel:${order.clientPhone}`}
                className="w-12 h-12 rounded-2xl bg-[#87C025] flex items-center justify-center shadow-lg shadow-[#87C025]/30 active:scale-90 transition-transform hover:bg-[#76a820]"
                title="Appeler"
              >
                <Phone className="w-6 h-6 text-white fill-current" />
              </a>
            </div>
          </div>

          {order.paymentMethod === 'cash' && (order.status === 'pending' || order.status === 'accepted') && (
            <div className="mt-6 flex flex-col gap-2">
              <div className="flex items-center gap-2 px-4 py-3 bg-orange-50 rounded-2xl border border-orange-100">
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <p className="text-[11px] font-bold text-orange-800 leading-tight">
                  Paiement prévu en espèces. Nous vous recommandons de confirmer par téléphone.
                </p>
              </div>
              <a 
                href={`tel:${order.clientPhone}`} 
                className="w-full bg-white text-[#FF4B11] border-2 border-[#FF4B11]/20 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.1em] flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-[#FF4B11]/5"
              >
                Appeler pour confirmer
              </a>
            </div>
          )}
        </div>

        {/* Delivery info */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-neutral-100">
          <div className="flex items-center gap-2 mb-4">
            {order.deliveryMode === 'delivery' ? <Truck className="w-4 h-4 text-neutral-400" /> : <MapPin className="w-4 h-4 text-neutral-400" />}
            <h3 className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">
              Mode : {order.deliveryMode === 'delivery' ? 'Livraison' : 'Retrait'}
            </h3>
          </div>
          {order.deliveryMode === 'delivery' && (
            <div className="flex items-start gap-3 bg-neutral-50 p-3 rounded-2xl border border-neutral-100/50">
              <MapPin className="w-5 h-5 text-[#FF4B11] mt-0.5" />
              <p className="text-sm text-neutral-900 font-extrabold leading-tight">{order.address}</p>
            </div>
          )}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-dashed border-neutral-100">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-neutral-400" />
              <span className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">Paiement</span>
            </div>
            <span className="text-sm font-black text-neutral-900 uppercase tracking-tight">{PAYMENT_LABEL[order.paymentMethod]}</span>
          </div>
        </div>

        {/* Order items */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-neutral-100">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="w-4 h-4 text-neutral-400" />
            <h3 className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">Détails Articles</h3>
          </div>
          <div className="space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#FDF6EC] flex items-center justify-center border border-[#FF4B11]/5">
                    <span className="font-black text-sm text-[#FF4B11]">{item.qty}×</span>
                  </div>
                  <div>
                    <span className="text-sm font-black text-neutral-900">{item.name}</span>
                    <p className="text-[10px] font-extrabold text-neutral-400 mt-0.5 uppercase">{formatPrice(item.price)} / unité</p>
                  </div>
                </div>
                <span className="font-black text-sm text-neutral-900">{formatPrice(item.qty * item.price)}</span>
              </div>
            ))}
          </div>
          <div className="border-t-2 border-dashed border-neutral-100 mt-5 pt-5 flex justify-between items-center">
            <span className="font-black text-neutral-900 uppercase tracking-widest text-xs">Total à percevoir</span>
            <span className="font-black text-2xl text-[#87C025]">{formatPrice(orderTotal)}</span>
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
              return (
                <div key={s} className="flex gap-3 relative">
                  {i < STATUS_FLOW.length - 1 && (
                    <div className={`absolute left-[15px] top-8 w-0.5 h-5 ${done ? 'bg-[#87C025]' : 'bg-neutral-200'}`} />
                  )}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    done ? 'bg-[#87C025]' : active ? 'bg-[#FF4B11] shadow-lg' : 'bg-neutral-200'
                  }`}>
                    {done ? '✓' : i + 1}
                  </div>
                  <div className="flex-1 pb-1 flex items-center">
                    <p className={`font-bold text-sm ${
                      done ? 'text-[#87C025]' : active ? 'text-[#FF4B11]' : 'text-neutral-400'
                    }`}>
                      {sCfg.label}
                    </p>
                    {active && <span className="ml-2 w-2 h-2 rounded-full bg-[#FF4B11] animate-pulse" />}
                  </div>
                </div>
              );
            })}

            {order.status === 'refused' && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-gray-400" />
                </div>
                <p className="font-bold text-sm text-gray-500">Commande refusée</p>
              </div>
            )}
          </div>
        </div>

        {/* Historique des actions (Tracabilité) */}
        {order.logs && order.logs.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-4 h-4 text-neutral-400" />
              <h3 className="text-sm font-extrabold text-neutral-900">Traçabilité</h3>
            </div>
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
            className="w-full bg-[#87C025] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#87C025]/30 active:scale-[0.98] transition-all"
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
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center font-bold text-red-600">
                <AlertTriangle className="w-5 h-5" />
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
              <button onClick={() => setShowDriverSelect(false)} className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center active:scale-90 transition-transform">
                <X className="w-5 h-5 text-neutral-600" />
              </button>
            </div>
            
            <div className="space-y-3 mb-4">
              {BRANCH_LIVREURS.filter(l => l.branchId === order.branchId && l.isActive).map(livreur => (
                <button
                  key={livreur.id}
                  onClick={() => assignDriver(livreur.id)}
                  className="w-full flex items-center gap-4 bg-neutral-50 p-3 rounded-2xl active:bg-neutral-100 border border-transparent focus:border-[#87C025] text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-[#87C025]/10 flex items-center justify-center text-[#87C025]">
                    <Bike className="w-6 h-6" />
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





