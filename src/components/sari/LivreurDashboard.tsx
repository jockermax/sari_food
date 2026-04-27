import React, { useState } from 'react';
import {
  MapPin, Phone, CheckCircle, Navigation, Truck, LogOut,
  Moon, Sun, Camera, FileText, TrendingUp, DollarSign,
  BarChart3, Star
} from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { BRANCH_ORDERS } from '@/data/managerData';
import { formatPrice } from '@/data/sariData';

const RATE_PER_DELIVERY = 500; // FCFA

const EARNINGS_DATA = [
  { day: 'Lun', count: 8 },
  { day: 'Mar', count: 12 },
  { day: 'Mer', count: 6 },
  { day: 'Jeu', count: 15 },
  { day: 'Ven', count: 10 },
  { day: 'Sam', count: 18 },
  { day: 'Dim', count: 11 },
];

const LivreurDashboard: React.FC = () => {
  const { setScreen, setIsAuthenticated } = useAppContext();
  const [isOnline, setIsOnline]   = useState(true);
  const [darkMode, setDarkMode]   = useState(false);
  const [activeTab, setActiveTab] = useState<'courses' | 'gains'>('courses');
  const [orders, setOrders] = useState(
    BRANCH_ORDERS.filter(o => o.livreurId === 'l1' && ['ready', 'delivering', 'delivered'].includes(o.status))
  );
  const [showProof, setShowProof]           = useState<string | null>(null);
  const [proofNote, setProofNote]           = useState('');
  const [proofConfirmed, setProofConfirmed] = useState<string[]>([]);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    if (newStatus === 'delivered') {
      setShowProof(id); // show proof-of-delivery modal
    } else {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus as any } : o));
    }
  };

  const confirmDelivery = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'delivered' as any } : o));
    setProofConfirmed(prev => [...prev, id]);
    setShowProof(null);
    setProofNote('');
  };

  const deliveredToday  = orders.filter(o => o.status === 'delivered').length;
  const weekCount       = EARNINGS_DATA.reduce((s, d) => s + d.count, 0);
  const todayEarnings   = deliveredToday * RATE_PER_DELIVERY;
  const weekEarnings    = weekCount * RATE_PER_DELIVERY;

  const bg     = darkMode ? 'bg-[#0F172A]' : 'bg-neutral-50';
  const card   = darkMode ? 'bg-[#1E293B]' : 'bg-white';
  const text   = darkMode ? 'text-white' : 'text-neutral-900';
  const muted  = darkMode ? 'text-slate-400' : 'text-neutral-500';
  const border = darkMode ? 'border-slate-700' : 'border-neutral-100';

  return (
    <div className={`min-h-screen ${bg} pb-24 transition-colors duration-300`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-[#1E40AF]' : 'bg-[#2563EB]'} px-5 pt-12 pb-6 rounded-b-3xl shadow-md relative overflow-hidden transition-colors duration-300`}>
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="flex items-center justify-between mb-6 relative">
          <div>
            <h1 className="text-xl font-extrabold text-white">Espace Livreur</h1>
            <p className="text-white/80 text-sm">Zone: Thiès &amp; Environs</p>
          </div>
          <div className="flex gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
              title={darkMode ? 'Mode clair' : 'Mode sombre'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => { setIsAuthenticated(false); setScreen('role-select'); }}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Online toggle */}
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-4 flex items-center justify-between shadow-sm`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full animate-pulse ${isOnline ? 'bg-[#16A34A]' : 'bg-neutral-300'}`} />
            <div>
              <p className={`font-bold ${text}`}>{isOnline ? 'En ligne' : 'Hors ligne'}</p>
              <p className={`text-xs ${muted}`}>{isOnline ? 'Prêt pour la livraison' : 'Vous ne recevez pas de courses'}</p>
            </div>
          </div>
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`w-14 h-8 rounded-full flex items-center p-1 transition-colors ${isOnline ? 'bg-[#16A34A]' : 'bg-neutral-300'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${isOnline ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 px-5 mt-6">
        {[
          { label: "Aujourd'hui", value: deliveredToday, color: 'text-[#2563EB]' },
          { label: 'Cette semaine', value: weekCount, color: 'text-[#16A34A]' },
          { label: 'Ce mois', value: 180, color: 'text-[#7C3AED]' },
        ].map((s, i) => (
          <div key={i} className={`${card} rounded-2xl p-3 shadow-sm border ${border} flex flex-col items-center transition-colors`}>
            <span className={`text-xs ${muted} font-bold mb-1`}>{s.label}</span>
            <span className={`text-xl font-extrabold ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-5 mt-5 flex gap-3">
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'courses'
              ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/30'
              : `${card} ${muted}`
          }`}
        >
          <Truck className="w-4 h-4" />
          Courses
        </button>
        <button
          onClick={() => setActiveTab('gains')}
          className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'gains'
              ? 'bg-[#16A34A] text-white shadow-lg shadow-[#16A34A]/30'
              : `${card} ${muted}`
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Mes Gains
        </button>
      </div>

      {/* ── GAINS TAB ───────────────────────────── */}
      {activeTab === 'gains' && (
        <div className="px-5 mt-5 space-y-4">
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`${card} rounded-2xl p-4 shadow-sm border ${border}`}>
              <DollarSign className="w-5 h-5 text-[#16A34A] mb-2" />
              <p className={`text-xl font-extrabold text-[#16A34A]`}>{formatPrice(todayEarnings)}</p>
              <p className={`text-xs ${muted} mt-1`}>Gains aujourd'hui</p>
            </div>
            <div className={`${card} rounded-2xl p-4 shadow-sm border ${border}`}>
              <TrendingUp className="w-5 h-5 text-[#2563EB] mb-2" />
              <p className={`text-xl font-extrabold text-[#2563EB]`}>{formatPrice(weekEarnings)}</p>
              <p className={`text-xs ${muted} mt-1`}>Gains semaine</p>
            </div>
          </div>

          {/* Rate info */}
          <div className={`${card} rounded-2xl p-4 shadow-sm border ${border} flex items-center gap-3`}>
            <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] flex items-center justify-center">
              <Star className="w-5 h-5 text-[#16A34A]" />
            </div>
            <div>
              <p className={`font-bold text-sm ${text}`}>Tarif : {formatPrice(RATE_PER_DELIVERY)} / course</p>
              <p className={`text-xs ${muted}`}>{deliveredToday} livraison{deliveredToday > 1 ? 's' : ''} validée{deliveredToday > 1 ? 's' : ''} aujourd'hui</p>
            </div>
          </div>

          {/* Weekly bar chart */}
          <div className={`${card} rounded-2xl p-4 shadow-sm border ${border}`}>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-[#2563EB]" />
              <h4 className={`font-bold text-sm ${text}`}>Livraisons par jour</h4>
            </div>
            <div className="flex items-end gap-1.5 h-24">
              {EARNINGS_DATA.map((d, i) => {
                const max = Math.max(...EARNINGS_DATA.map(x => x.count));
                const isToday = i === 5; // Saturday = "today" in demo
                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-lg transition-all duration-500"
                      style={{
                        height: `${(d.count / max) * 100}%`,
                        backgroundColor: isToday ? '#16A34A' : (darkMode ? '#334155' : '#BFDBFE'),
                      }}
                    />
                    <span className={`text-[9px] font-bold ${isToday ? 'text-[#16A34A]' : muted}`}>{d.day}</span>
                    <span className={`text-[9px] ${muted}`}>{d.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── COURSES TAB ─────────────────────────── */}
      {activeTab === 'courses' && (
        <div className="px-5 mt-6 space-y-4">
          <h2 className={`font-extrabold ${text}`}>Courses actuelles</h2>
          {orders.length === 0 ? (
            <div className="text-center py-10">
              <Truck className={`w-16 h-16 ${muted} mx-auto mb-3`} />
              <h2 className={`${muted} font-bold`}>Aucune course pour le moment</h2>
            </div>
          ) : (
            orders.map(order => {
              if (order.status === 'delivered') {
                return (
                  <div key={order.id} className={`${darkMode ? 'bg-[#14532D]/40 border-[#16A34A]/30' : 'bg-[#F0FDF4] border-green-200'} rounded-2xl p-4 shadow-sm border opacity-80`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className={`font-extrabold ${darkMode ? 'text-green-400' : 'text-green-800'}`}>Livraison effectuée</p>
                      </div>
                      <span className={`font-bold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>{formatPrice(order.total)}</span>
                    </div>
                    <p className={`text-xs ${darkMode ? 'text-green-500' : 'text-green-600'} mt-2 font-medium`}>
                      {order.clientName} · #{order.id}
                      {proofConfirmed.includes(order.id) ? ' · 📸 Preuve enregistrée' : ''}
                    </p>
                  </div>
                );
              }

              return (
                <div key={order.id} className={`${card} rounded-2xl shadow-sm border-2 ${border} overflow-hidden transition-colors`}>
                  <div className={`p-4 border-b ${border}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                          order.status === 'delivering'
                            ? (darkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-[#EFF6FF] text-[#2563EB]')
                            : (darkMode ? 'bg-green-900/40 text-green-400' : 'bg-[#F0FDF4] text-[#16A34A]')
                        }`}>
                          #{order.id}
                        </span>
                        <p className={`font-extrabold ${text} mt-2`}>{order.clientName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#C94A2A]">{formatPrice(order.total)}</p>
                        <p className={`text-xs ${muted}`}>{order.paymentMethod === 'cash' ? 'À payer en espèces' : 'Déjà payé'}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${muted} mb-2`}>
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">{order.address}</span>
                    </div>
                  </div>

                  <div className={`p-3 ${darkMode ? 'bg-slate-900/50' : 'bg-neutral-50'} flex gap-2`}>
                    <a href={`tel:${order.clientPhone}`}
                      className={`w-12 h-12 ${card} rounded-xl shadow-sm flex items-center justify-center border ${border}`}>
                      <Phone className="w-5 h-5 text-[#16A34A]" />
                    </a>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.address + ', Mbour, Senegal')}`}
                      target="_blank" rel="noopener noreferrer"
                      className={`w-12 h-12 ${card} rounded-xl shadow-sm flex items-center justify-center border ${border}`}
                    >
                      <Navigation className="w-5 h-5 text-[#2563EB]" />
                    </a>
                    {order.status === 'ready' ? (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'delivering')}
                        className="flex-1 bg-[#16A34A] text-white font-bold rounded-xl shadow-md active:scale-95 transition-transform"
                      >
                        Démarrer
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'delivered')}
                        className="flex-1 bg-[#2563EB] text-white font-bold rounded-xl shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Terminée
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Delivery Proof Modal ─────────────────── */}
      {showProof && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end max-w-md mx-auto">
          <div className="bg-white rounded-t-3xl w-full p-5" style={{ animation: 'slideUp 0.25s ease-out' }}>
            <h3 className="font-extrabold text-neutral-900 text-lg mb-1">Confirmer la livraison</h3>
            <p className="text-xs text-neutral-500 mb-5">Ajoutez une preuve optionnelle avant de valider</p>

            {/* Simulate camera */}
            <button className="w-full h-32 border-2 border-dashed border-neutral-300 rounded-2xl flex flex-col items-center justify-center gap-2 mb-4 active:bg-neutral-50">
              <Camera className="w-8 h-8 text-neutral-300" />
              <span className="text-xs text-neutral-400 font-medium">Prendre une photo du colis (optionnel)</span>
            </button>

            <div className="mb-4">
              <label className="text-xs font-bold text-neutral-500 uppercase mb-1 block">Note (optionnelle)</label>
              <input
                value={proofNote}
                onChange={e => setProofNote(e.target.value)}
                placeholder="ex: Déposé devant la porte, client absent..."
                className="w-full bg-neutral-50 rounded-xl px-4 py-3 text-sm outline-none border border-neutral-200 focus:border-[#2563EB]"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowProof(null)}
                className="flex-1 bg-neutral-100 text-neutral-700 font-bold py-3 rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={() => confirmDelivery(showProof)}
                className="flex-1 bg-[#2563EB] text-white font-bold py-3 rounded-xl shadow-lg shadow-[#2563EB]/30 active:scale-[0.98]"
              >
                Valider la livraison
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
    </div>
  );
};

export default LivreurDashboard;
