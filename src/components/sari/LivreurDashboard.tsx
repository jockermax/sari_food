import React, { useState } from 'react';

import { useAppContext } from '@/contexts/AppContext';
import { BRANCH_ORDERS } from '@/data/managerData';
import { formatPrice } from '@/data/sariData';
import { 
  LogOut, 
  Moon, 
  Sun, 
  Bike, 
  ShoppingBag, 
  TrendingUp, 
  Calendar, 
  Phone, 
  MessageCircle, 
  MapPin, 
  CheckCircle, 
  Camera, 
  ChevronRight,
  DollarSign,
  User,
  Power
} from 'lucide-react';

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
      <div className={`${darkMode ? 'bg-slate-900' : 'bg-[#FF4B11]'} px-5 pt-12 pb-10 rounded-b-[40px] shadow-lg relative overflow-hidden transition-colors duration-500`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/5 rounded-full blur-2xl -ml-10 -mb-10" />
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bike className="w-5 h-5 text-white/60" />
              <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">Espace Livreur</p>
            </div>
            <h1 className="text-2xl font-black text-white leading-none">Thiès Zone</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-11 h-11 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white active:scale-90 transition-all border border-white/10 hover:bg-white/20"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => { setIsAuthenticated(false); setScreen('role-select'); }}
              className="w-11 h-11 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white active:scale-90 transition-all border border-white/10 hover:bg-white/20"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Online toggle */}
        <div className={`${darkMode ? 'bg-slate-800/80' : 'bg-white/10'} backdrop-blur-xl rounded-[28px] p-5 flex items-center justify-between border border-white/10 relative z-10`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isOnline ? 'bg-[#87C025] shadow-lg shadow-[#87C025]/30' : 'bg-white/10'}`}>
              <Power className={`w-6 h-6 text-white ${isOnline ? 'animate-pulse' : 'opacity-40'}`} />
            </div>
            <div>
              <p className="font-black text-white text-base leading-tight">{isOnline ? 'Vous êtes en ligne' : 'Vous êtes hors ligne'}</p>
              <p className="text-[11px] font-bold text-white/50 mt-1">{isOnline ? 'Prêt pour la prochaine course' : 'Activez pour recevoir des livraisons'}</p>
            </div>
          </div>
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`w-16 h-9 rounded-full flex items-center px-1.5 transition-all shadow-inner ${isOnline ? 'bg-[#87C025]' : 'bg-white/20'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full shadow-xl transition-transform duration-300 ${isOnline ? 'translate-x-7' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 px-5 mt-8">
        {[
          { label: "Aujourd'hui", value: deliveredToday, color: '#FF4B11', icon: ShoppingBag },
          { label: 'Semaine', value: weekCount, color: '#87C025', icon: TrendingUp },
          { label: 'Mois', value: 180, color: '#3B82F6', icon: Calendar },
        ].map((s, i) => (
          <div key={i} className={`${card} rounded-3xl p-4 shadow-sm border ${border} flex flex-col items-center transition-all hover:scale-105 active:scale-95`}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: `${s.color}15` }}>
              <s.icon className="w-4.5 h-4.5" style={{ color: s.color }} />
            </div>
            <span className={`text-[10px] ${muted} font-black uppercase tracking-wider mb-1`}>{s.label}</span>
            <span className={`text-xl font-black ${text}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className={`mx-5 mt-8 p-1.5 rounded-[24px] ${darkMode ? 'bg-slate-800' : 'bg-neutral-100'} flex gap-1`}>
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex-1 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
            activeTab === 'courses'
              ? 'bg-white shadow-md text-[#FF4B11]'
              : `${muted} hover:text-neutral-900`
          }`}
        >
          <Bike className="w-4 h-4" />
          Missions
        </button>
        <button
          onClick={() => setActiveTab('gains')}
          className={`flex-1 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
            activeTab === 'gains'
              ? 'bg-white shadow-md text-[#87C025]'
              : `${muted} hover:text-neutral-900`
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Revenus
        </button>
      </div>

      {/* ── GAINS TAB ───────────────────────────── */}
      {activeTab === 'gains' && (
        <div className="px-5 mt-8 space-y-6 animate-fade-in">
          {/* Summary cards with glass effect */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`${card} rounded-[32px] p-5 shadow-sm border ${border} relative overflow-hidden group`}>
              <div className="absolute -right-2 -top-2 w-12 h-12 bg-[#87C025]/10 rounded-full blur-xl group-hover:bg-[#87C025]/20 transition-colors" />
              <div className="w-10 h-10 rounded-xl bg-[#87C025]/10 flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5 text-[#87C025]" />
              </div>
              <p className={`text-xl font-black ${text}`}>{formatPrice(todayEarnings)}</p>
              <p className={`text-[10px] font-black uppercase tracking-widest ${muted} mt-1`}>Aujourd'hui</p>
            </div>
            <div className={`${card} rounded-[32px] p-5 shadow-sm border ${border} relative overflow-hidden group`}>
              <div className="absolute -right-2 -top-2 w-12 h-12 bg-[#FF4B11]/10 rounded-full blur-xl group-hover:bg-[#FF4B11]/20 transition-colors" />
              <div className="w-10 h-10 rounded-xl bg-[#FF4B11]/10 flex items-center justify-center mb-3">
                <DollarSign className="w-5 h-5 text-[#FF4B11]" />
              </div>
              <p className={`text-xl font-black ${text}`}>{formatPrice(weekEarnings)}</p>
              <p className={`text-[10px] font-black uppercase tracking-widest ${muted} mt-1`}>Cette semaine</p>
            </div>
          </div>

          {/* Rate info card */}
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-[32px] p-5 shadow-sm border ${border} flex items-center gap-4`}>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#87C025] to-[#76a820] flex items-center justify-center shadow-lg shadow-[#87C025]/20">
              <Bike className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <p className={`text-base font-black ${text} leading-tight`}>Tarif : {formatPrice(RATE_PER_DELIVERY)} / course</p>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-1.5 h-1.5 rounded-full ${deliveredToday > 0 ? 'bg-[#87C025]' : 'bg-neutral-300'}`} />
                <p className={`text-xs font-bold ${muted}`}>{deliveredToday} course{deliveredToday > 1 ? 's' : ''} validée{deliveredToday > 1 ? 's' : ''} aujourd'hui</p>
              </div>
            </div>
          </div>

          {/* Weekly bar chart redesigned */}
          <div className={`${card} rounded-[32px] p-6 shadow-sm border ${border}`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center border border-neutral-100">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                </div>
                <h4 className={`font-black text-sm uppercase tracking-widest ${text}`}>Activité hebdomadaire</h4>
              </div>
              <div className="px-3 py-1 bg-neutral-100 rounded-lg">
                <span className="text-[10px] font-black text-neutral-500 uppercase">Livraisons</span>
              </div>
            </div>
            
            <div className="flex items-end gap-3 h-32 px-2">
              {EARNINGS_DATA.map((d, i) => {
                const max = Math.max(...EARNINGS_DATA.map(x => x.count));
                const isToday = i === 5; // Samedi dans la démo
                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-3 group">
                    <div className="relative w-full flex flex-col items-center">
                      {/* Tooltip on hover */}
                      <div className="absolute -top-8 bg-neutral-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {d.count}
                      </div>
                      <div
                        className={`w-full rounded-full transition-all duration-700 delay-${i * 100} ease-out cursor-pointer hover:brightness-110 shadow-sm`}
                        style={{
                          height: `${(d.count / max) * 100}%`,
                          backgroundColor: isToday ? '#87C025' : (darkMode ? '#334155' : '#F1F5F9'),
                          boxShadow: isToday ? '0 4px 12px rgba(135, 192, 37, 0.3)' : 'none'
                        }}
                      />
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <span className={`text-[10px] font-black uppercase tracking-tighter ${isToday ? 'text-[#87C025]' : muted}`}>{d.day}</span>
                    </div>
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
              <h2 className={`${muted} font-bold`}>Aucune course pour le moment</h2>
            </div>
          ) : (
            orders.map(order => {
              if (order.status === 'delivered') {
                return (
                  <div key={order.id} className={`${darkMode ? 'bg-[#2B4D00]/40 border-[#87C025]/30' : 'bg-[#FDF6EC] border-green-200'} rounded-3xl p-5 shadow-sm border opacity-80 group`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#87C025] flex items-center justify-center text-white">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <p className={`font-black text-sm ${darkMode ? 'text-green-400' : 'text-green-800'} uppercase tracking-tight`}>Livraison effectuée</p>
                          <p className={`text-[10px] font-bold ${muted} mt-0.5`}>{order.clientName} · #{order.id.slice(-6)}</p>
                        </div>
                      </div>
                      <span className={`font-black text-base ${darkMode ? 'text-green-400' : 'text-green-700'}`}>{formatPrice(order.total)}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div key={order.id} className={`${card} rounded-[32px] shadow-sm border-2 ${border} overflow-hidden transition-all group`}>
                  <div className="p-5">
                    {/* ID & Payment Status */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                          order.status === 'delivering'
                            ? (darkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-[#FF4B11]/5 text-[#FF4B11]')
                            : (darkMode ? 'bg-green-900/40 text-green-400' : 'bg-[#87C025]/5 text-[#87C025]')
                        }`}>
                          #{order.id.slice(-6)}
                        </div>
                        {order.status === 'delivering' && (
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4B11] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF4B11]"></span>
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-end">
                        <p className={`text-[10px] font-black uppercase tracking-widest ${order.paymentMethod === 'cash' ? 'text-[#FF4B11]' : 'text-[#87C025]'}`}>
                          {order.paymentMethod === 'cash' ? 'À encaisser' : 'Payé'}
                        </p>
                        <p className="text-lg font-black text-neutral-900 leading-none mt-1">{formatPrice(order.total)}</p>
                      </div>
                    </div>

                    {/* Client Info */}
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-12 h-12 rounded-[18px] bg-neutral-100 flex items-center justify-center border border-neutral-100">
                        <User className="w-6 h-6 text-neutral-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-base font-black ${text} leading-tight truncate`}>{order.clientName}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-[#FF4B11]" />
                          <p className={`text-xs font-bold ${muted} truncate`}>{order.address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                      <a href={`tel:${order.clientPhone}`}
                        className={`w-12 h-12 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-neutral-50 border-neutral-100'} rounded-2xl flex items-center justify-center border active:scale-90 transition-all hover:bg-neutral-100`}>
                        <Phone className="w-5 h-5 text-neutral-500" />
                      </a>
                      <a href={`https://wa.me/${order.clientPhone.replace(/\s/g, '')}`} target="_blank" rel="noreferrer"
                        className={`w-12 h-12 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-neutral-50 border-neutral-100'} rounded-2xl flex items-center justify-center border active:scale-90 transition-all hover:bg-neutral-100`}>
                        <MessageCircle className="w-5 h-5 text-neutral-500" />
                      </a>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.address + ', Mbour, Senegal')}`}
                        target="_blank" rel="noopener noreferrer"
                        className={`w-12 h-12 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-neutral-50 border-neutral-100'} rounded-2xl flex items-center justify-center border active:scale-90 transition-all hover:bg-neutral-100`}
                      >
                        <MapPin className="w-5 h-5 text-neutral-500" />
                      </a>

                      {order.status === 'ready' ? (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'delivering')}
                          className="flex-1 bg-[#87C025] text-white font-black text-xs uppercase tracking-[0.1em] rounded-2xl shadow-lg shadow-[#87C025]/30 active:scale-[0.98] transition-all"
                        >
                          Démarrer
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'delivered')}
                          className="flex-1 bg-[#FF4B11] text-white font-black text-xs uppercase tracking-[0.1em] rounded-2xl shadow-lg shadow-[#FF4B11]/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Terminée
                        </button>
                      )}
                    </div>
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
              
              <span className="text-xs text-neutral-400 font-medium">Prendre une photo du colis (optionnel)</span>
            </button>

            <div className="mb-4">
              <label className="text-xs font-bold text-neutral-500 uppercase mb-1 block">Note (optionnelle)</label>
              <input
                value={proofNote}
                onChange={e => setProofNote(e.target.value)}
                placeholder="ex: Déposé devant la porte, client absent..."
                className="w-full bg-neutral-50 rounded-xl px-4 py-3 text-sm outline-none border border-neutral-200 focus:border-[#FF4B11]"
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
                className="flex-1 bg-[#FF4B11] text-white font-bold py-3 rounded-xl shadow-lg shadow-[#FF4B11]/30 active:scale-[0.98]"
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





