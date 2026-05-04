import React, { useState } from 'react';

import { useAppContext } from '@/contexts/AppContext';
import { OWNER_BRANCHES, BRANCH_ORDERS, Branch } from '@/data/managerData';
import { formatPrice } from '@/data/sariData';
import { LOGO_URL } from '@/data/sariData';
import { 
  BarChart3, 
  ShoppingBag, 
  DollarSign, 
  Store, 
  Star, 
  TrendingUp, 
  Calendar, 
  Download, 
  Plus, 
  MapPin, 
  Bell, 
  LogOut,
  ChevronRight,
  PieChart
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const PERIOD_DATA: Record<string, { label: string; revenue: number; orders: number }[]> = {
  today: [
    { label: '8h', revenue: 45000, orders: 12 },
    { label: '10h', revenue: 78000, orders: 21 },
    { label: '12h', revenue: 135000, orders: 38 },
    { label: '14h', revenue: 95000, orders: 28 },
    { label: '16h', revenue: 62000, orders: 17 },
    { label: '18h', revenue: 118000, orders: 33 },
    { label: '20h', revenue: 88000, orders: 24 },
  ],
  week: [
    { label: 'Lun', revenue: 320000, orders: 89 },
    { label: 'Mar', revenue: 410000, orders: 112 },
    { label: 'Mer', revenue: 285000, orders: 76 },
    { label: 'Jeu', revenue: 520000, orders: 145 },
    { label: 'Ven', revenue: 640000, orders: 178 },
    { label: 'Sam', revenue: 780000, orders: 215 },
    { label: 'Dim', revenue: 490000, orders: 134 },
  ],
  month: [
    { label: 'S1', revenue: 1850000, orders: 512 },
    { label: 'S2', revenue: 2100000, orders: 583 },
    { label: 'S3', revenue: 1780000, orders: 491 },
    { label: 'S4', revenue: 2430000, orders: 675 },
  ],
};

type DateFilter = 'today' | 'week' | 'month' | 'year';

const DATE_FILTER_LABELS: Record<DateFilter, string> = {
  today: "Aujourd'hui",
  week: 'Cette semaine',
  month: 'Ce mois',
  year: 'Cette année',
};

// Mock multipliers so numbers look different per period
const PERIOD_MULTIPLIER: Record<DateFilter, number> = {
  today: 1, week: 7, month: 30, year: 365,
};

// Bar chart data – simulated hourly peak for "today" view
const HOURLY_DATA = [
  { label: '9h', value: 3 },
  { label: '10h', value: 5 },
  { label: '11h', value: 8 },
  { label: '12h', value: 18 },
  { label: '13h', value: 22 },
  { label: '14h', value: 14 },
  { label: '15h', value: 7 },
  { label: '16h', value: 6 },
  { label: '17h', value: 9 },
  { label: '18h', value: 11 },
  { label: '19h', value: 24 },
  { label: '20h', value: 20 },
];

const MiniBarChart: React.FC<{ data: typeof HOURLY_DATA; color: string }> = ({ data, color }) => {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="flex items-end gap-1 h-20 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md transition-all duration-500"
            style={{ height: `${(d.value / max) * 100}%`, backgroundColor: color, opacity: 0.75 + (d.value / max) * 0.25 }}
          />
          <span className="text-[8px] text-neutral-400 font-medium">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

const OwnerDashboard: React.FC = () => {
  const { setScreen, setActiveBranchId, setIsAuthenticated } = useAppContext();
  const [branches, setBranches] = useState<Branch[]>(OWNER_BRANCHES);
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('week');
  const [dateFilter, setDateFilter] = useState<DateFilter>('today');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const mult = PERIOD_MULTIPLIER[dateFilter];

  const totalOrdersToday  = branches.reduce((s, b) => s + b.ordersToday, 0)  * (dateFilter === 'today' ? 1 : Math.round(mult * 0.85));
  const totalRevenueToday = branches.reduce((s, b) => s + b.revenueToday, 0) * (dateFilter === 'today' ? 1 : Math.round(mult * 0.9));
  const totalRevenueMonth = branches.reduce((s, b) => s + b.revenueMonth, 0);
  const openBranches      = branches.filter(b => b.isOpen).length;
  const pendingOrders     = BRANCH_ORDERS.filter(o => o.status === 'pending').length;

  const periodRevenue = dateFilter === 'month' || dateFilter === 'year'
    ? totalRevenueMonth * (dateFilter === 'year' ? 12 : 1)
    : totalRevenueToday;

  const periodOrders = totalOrdersToday;

  const toggleOpen = (id: string) =>
    setBranches(prev => prev.map(b => b.id === id ? { ...b, isOpen: !b.isOpen } : b));

  const handleManage = (branch: Branch) => {
    setActiveBranchId(branch.id);
    setScreen('owner-branch');
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    setShowExportMenu(false);
    // Simulate export toast
    alert(`Export ${format.toUpperCase()} simulé pour la période : ${DATE_FILTER_LABELS[dateFilter]}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <div className="bg-[#87C025] px-5 pt-10 pb-24 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute bottom-0 left-10 w-28 h-28 rounded-full bg-white/5" />
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/30">
                <img src={LOGO_URL} alt="SARI" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-white/70 text-xs uppercase tracking-widest">Propriétaire</p>
                <h1 className="text-white text-lg font-extrabold">Chez Aminata</h1>
              </div>
            </div>
            <div className="flex gap-2">
              {pendingOrders > 0 && (
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF4B11] rounded-full text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#87C025]">
                    {pendingOrders}
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

          {/* Summary stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/15 rounded-2xl p-4 backdrop-blur-md border border-white/10">
              <ShoppingBag className="w-5 h-5 text-white/60 mb-2" />
              <p className="text-white font-extrabold text-2xl leading-none">{periodOrders}</p>
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider mt-2">Commandes</p>
            </div>
            <div className="bg-white/15 rounded-2xl p-4 backdrop-blur-md border border-white/10">
              <DollarSign className="w-5 h-5 text-white/60 mb-2" />
              <p className="text-white font-extrabold text-xl leading-none">{formatPrice(periodRevenue)}</p>
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider mt-2">Revenus</p>
            </div>
            <div className="bg-white/15 rounded-2xl p-4 backdrop-blur-md border border-white/10">
              <Store className="w-5 h-5 text-white/60 mb-2" />
              <p className="text-white font-extrabold text-2xl leading-none">{openBranches}/{branches.length}</p>
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider mt-2">Locaux ouverts</p>
            </div>
            <div className="bg-white/15 rounded-2xl p-4 backdrop-blur-md border border-white/10">
              <Star className="w-5 h-5 text-white/60 mb-2" />
              <p className="text-white font-extrabold text-2xl leading-none">4.6</p>
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider mt-2">Note globale</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Date filter + Export ─────────────────────── */}
      <div className="px-5 -mt-14 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#87C025]" />
              <span className="text-sm font-extrabold text-neutral-900 uppercase tracking-tight">Période d'analyse</span>
            </div>
            {/* Export button */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2 bg-[#87C025] text-white text-[11px] font-extrabold px-4 py-2.5 rounded-xl shadow-lg shadow-[#87C025]/30 active:scale-95 transition-transform"
              >
                <Download className="w-3.5 h-3.5" />
                EXPORTER
              </button>
              {showExportMenu && (
                <div className="absolute right-0 top-10 bg-white rounded-xl shadow-xl border border-neutral-100 z-20 overflow-hidden w-36">
                  <button onClick={() => handleExport('excel')}
                    className="w-full px-4 py-3 text-left text-sm font-bold text-neutral-900 hover:bg-neutral-50 flex items-center gap-2">
                    📊 Excel (.xlsx)
                  </button>
                  <div className="border-t border-neutral-100" />
                  <button onClick={() => handleExport('pdf')}
                    className="w-full px-4 py-3 text-left text-sm font-bold text-neutral-900 hover:bg-neutral-50 flex items-center gap-2">
                    📄 PDF
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Period pills */}
          <div className="grid grid-cols-4 gap-1.5">
            {(Object.keys(DATE_FILTER_LABELS) as DateFilter[]).map(f => (
              <button
                key={f}
                onClick={() => setDateFilter(f)}
                className={`py-2 rounded-xl text-[11px] font-bold transition-all ${
                  dateFilter === f
                    ? 'bg-[#87C025] text-white shadow-md'
                    : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {f === 'today' ? "Auj." : f === 'week' ? 'Semaine' : f === 'month' ? 'Mois' : 'Année'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Peak Hours Bar Chart ─────────────────────── */}
      <div className="px-5 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#87C025]" />
            <h4 className="font-extrabold text-sm text-neutral-900">Pics de commandes</h4>
            <span className="ml-auto text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{DATE_FILTER_LABELS[dateFilter]}</span>
          </div>
          <MiniBarChart data={HOURLY_DATA} color="#87C025" />
          <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400">
            <span>⬆ Pic : 19h–20h</span>
            <span>Max : 24 commandes/h</span>
          </div>
        </div>
      </div>

      {/* ── Revenue bar per branch ─────────────────── */}
      <div className="px-5 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-[#87C025]" />
            <h4 className="font-extrabold text-sm text-neutral-900">Revenus par local</h4>
          </div>
          <div className="space-y-3">
            {branches.map(b => {
              const rev = b.revenueToday * (dateFilter === 'today' ? 1 : Math.round(PERIOD_MULTIPLIER[dateFilter] * 0.9));
              const maxRev = Math.max(...branches.map(br => br.revenueToday)) * PERIOD_MULTIPLIER[dateFilter] * 0.9;
              const pct = Math.round((rev / maxRev) * 100);
              return (
                <div key={b.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-neutral-700 truncate max-w-[60%]">{b.name}</span>
                    <span className="text-xs font-extrabold text-[#87C025]">{formatPrice(rev)}</span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#87C025] to-[#FF4B11] rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Create new branch */}
      <div className="px-5 mt-4">
        <button
          onClick={() => setScreen('owner-create-branch')}
          className="w-full bg-white rounded-2xl p-4 shadow-sm border-2 border-dashed border-[#87C025]/40 flex items-center gap-3 active:scale-[0.98] transition-transform"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#87C025]/10 flex items-center justify-center flex-shrink-0">
            <Plus className="w-6 h-6 text-[#87C025]" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-extrabold text-sm text-neutral-900">Ouvrir un nouveau local</p>
            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-tight mt-0.5">Développer votre réseau Sari</p>
          </div>
          <ChevronRight className="w-5 h-5 text-[#87C025]/50" />        </button>
      </div>

      {/* Branches list */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-neutral-900">Mes locaux ({branches.length})</h2>
          <span className="text-xs text-neutral-500">{openBranches} ouvert{openBranches > 1 ? 's' : ''}</span>
        </div>

        <div className="space-y-4">
          {branches.map(branch => {
            const branchPending = BRANCH_ORDERS.filter(o => o.branchId === branch.id && o.status === 'pending').length;
            const branchLive    = BRANCH_ORDERS.filter(o => o.branchId === branch.id && !['delivered', 'refused'].includes(o.status)).length;
            return (
              <div
                key={branch.id}
                className={`bg-white rounded-2xl shadow-sm overflow-hidden border-2 transition-all ${branch.isOpen ? 'border-transparent' : 'border-neutral-100 opacity-80'}`}
              >
                <div className="relative h-32">
                  <img src={branch.image} alt={branch.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {!branch.isOpen && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-white text-neutral-900 px-4 py-1.5 rounded-full text-xs font-extrabold">Fermé</span>
                    </div>
                  )}
                  {branchPending > 0 && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#FF4B11] text-white text-[10px] font-extrabold px-2 py-1 rounded-full animate-pulse">
                        {branchPending} en attente
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-extrabold text-sm">{branch.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3 h-3 text-white/70" />
                      <span className="text-white/80 text-[10px] font-bold uppercase tracking-tight">{branch.neighborhood}, {branch.city}</span>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-neutral-500">Commandes</p>
                    <p className="font-extrabold text-sm text-neutral-900">{branch.ordersToday * (dateFilter === 'today' ? 1 : Math.round(PERIOD_MULTIPLIER[dateFilter] * 0.85))} cmd</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-neutral-500">Revenus</p>
                    <p className="font-extrabold text-sm text-[#87C025]">{formatPrice(branch.revenueToday * (dateFilter === 'today' ? 1 : Math.round(PERIOD_MULTIPLIER[dateFilter] * 0.9)))}</p>
                  </div>
                  {branch.rating > 0 && (
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="font-extrabold text-xs text-yellow-700">{branch.rating}</span>
                    </div>
                  )}
                  {branchLive > 0 && (
                    <div className="flex items-center gap-1.5 bg-[#FF4B11]/10 px-2 py-1 rounded-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF4B11] animate-pulse" />
                      <span className="text-xs font-bold text-[#FF4B11]">{branchLive} live</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-neutral-100 px-4 py-3 flex gap-2">
                  <button
                    onClick={() => toggleOpen(branch.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${branch.isOpen ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}
                  >
                    {branch.isOpen ? <> Ouvert</> : <> Fermé</>}
                  </button>
                  <button
                    onClick={() => handleManage(branch)}
                    className="flex-1 bg-[#87C025] text-white font-extrabold text-[11px] uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#87C025]/20 active:scale-[0.98] transition-transform"
                  >
                    Gérer ce local 
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;





