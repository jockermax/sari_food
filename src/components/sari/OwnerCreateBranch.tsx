import React, { useState } from 'react';
import { ArrowLeft, MapPin, ChevronDown, Clock, Phone, Truck, CheckCircle } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { CITIES } from '@/data/sariData';

interface FormData {
  name: string;
  city: string;
  neighborhood: string;
  address: string;
  cuisine: string;
  phone: string;
  openTime: string;
  closeTime: string;
  deliveryFee: string;
  deliveryRadius: string;
  avgPrepTime: string;
  managerName: string;
  managerPhone: string;
}

const CUISINE_OPTIONS = [
  'Burgers & Plats Sénégalais',
  'Burgers & Fast Food',
  'Burgers & Grillades',
  'Poulet & Grillades',
  'Cuisine Sénégalaise',
  'Shawarma & Tacos',
  'Pizza & Pasta',
  'Poissons & Riz',
];

const OwnerCreateBranch: React.FC = () => {
  const { setScreen } = useAppContext();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: '',
    city: '',
    neighborhood: '',
    address: '',
    cuisine: '',
    phone: '',
    openTime: '09:00',
    closeTime: '23:00',
    deliveryFee: '500',
    deliveryRadius: '3',
    avgPrepTime: '20',
    managerName: '',
    managerPhone: '',
  });

  const update = (key: keyof FormData, val: string) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const selectedCity = CITIES.find(c => c.name === form.city);

  const isValid =
    form.name.trim().length >= 3 &&
    form.city &&
    form.neighborhood &&
    form.address.trim().length >= 5 &&
    form.phone.trim().length >= 9 &&
    form.managerName.trim().length >= 3 &&
    form.managerPhone.trim().length >= 9;

  const handleSubmit = () => {
    if (!isValid) return;
    setSubmitted(true);
    setTimeout(() => setScreen('owner-dashboard'), 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F5F3FF] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 rounded-full bg-[#7C3AED]/10 flex items-center justify-center mb-5">
          <CheckCircle className="w-12 h-12 text-[#7C3AED]" />
        </div>
        <h2 className="text-2xl font-extrabold text-neutral-900 mb-2">Local créé !</h2>
        <p className="text-neutral-500 text-sm">
          <span className="font-bold">{form.name}</span> ({form.neighborhood}, {form.city}) a été ajouté à vos locaux.
        </p>
        <p className="text-xs text-neutral-400 mt-3">Redirection en cours...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-36">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => setScreen('owner-dashboard')}
            className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-700" />
          </button>
          <div>
            <h1 className="text-lg font-extrabold text-neutral-900">Nouveau local</h1>
            <p className="text-xs text-neutral-500">Ouvrir un restaurant dans une nouvelle zone</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-5">
        {/* ── Section 1 : Identification ─────────────────────────────── */}
        <Section title="🏪 Identification du local">
          <Field label="Nom du local *">
            <input
              value={form.name}
              onChange={e => update('name', e.target.value)}
              placeholder="ex: Chez Aminata — Kaolack Centre"
              className="input-field"
            />
          </Field>
          <Field label="Type de cuisine *">
            <div className="relative">
              <select
                value={form.cuisine}
                onChange={e => update('cuisine', e.target.value)}
                className="input-field appearance-none pr-10"
              >
                <option value="">Sélectionner...</option>
                {CUISINE_OPTIONS.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
          </Field>
        </Section>

        {/* ── Section : Gérant ───────────────────────────────────────── */}
        <Section title="👨‍🍳 Affectation du Gérant">
          <Field label="Nom du gérant *">
            <input
              value={form.managerName}
              onChange={e => update('managerName', e.target.value)}
              placeholder="Ex: Babacar Ndiaye"
              className="input-field"
            />
          </Field>
          <Field label="Téléphone du gérant *">
            <div className="flex items-center bg-white rounded-2xl border border-neutral-200">
              <div className="flex items-center gap-2 pl-4 pr-3 border-r border-neutral-200 h-12">
                <span className="text-lg">🇸🇳</span>
                <span className="text-neutral-700 font-medium text-sm">+221</span>
              </div>
              <input
                type="tel"
                value={form.managerPhone}
                onChange={e => update('managerPhone', e.target.value.replace(/[^\d\s]/g, ''))}
                placeholder="77 123 45 67"
                className="flex-1 h-12 bg-transparent outline-none px-4 text-sm"
              />
            </div>
          </Field>
        </Section>

        {/* ── Section 2 : Localisation ───────────────────────────────── */}
        <Section title="📍 Localisation">
          <Field label="Ville *">
            <div className="relative">
              <select
                value={form.city}
                onChange={e => { update('city', e.target.value); update('neighborhood', ''); }}
                className="input-field appearance-none pr-10"
              >
                <option value="">Sélectionner une ville...</option>
                {CITIES.map(c => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
          </Field>

          {selectedCity && (
            <Field label="Quartier / Zone *">
              <div className="relative">
                <select
                  value={form.neighborhood}
                  onChange={e => update('neighborhood', e.target.value)}
                  className="input-field appearance-none pr-10"
                >
                  <option value="">Sélectionner un quartier...</option>
                  {selectedCity.neighborhoods.map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </Field>
          )}

          <Field label="Adresse précise *">
            <input
              value={form.address}
              onChange={e => update('address', e.target.value)}
              placeholder="Rue, numéro, repère..."
              className="input-field"
            />
          </Field>

          {/* Map preview placeholder */}
          {form.city && form.neighborhood && (
            <div className="relative rounded-2xl overflow-hidden h-32 bg-neutral-200">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600"
                alt="Carte"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="bg-[#7C3AED] text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {form.neighborhood}, {form.city}
                </div>
              </div>
            </div>
          )}
        </Section>

        {/* ── Section 3 : Contact & Horaires ─────────────────────────── */}
        <Section title="📞 Contact & Horaires">
          <Field label="Numéro de téléphone du local *">
            <div className="flex items-center bg-white rounded-2xl border border-neutral-200">
              <div className="flex items-center gap-2 pl-4 pr-3 border-r border-neutral-200 h-12">
                <span className="text-lg">🇸🇳</span>
                <span className="text-neutral-700 font-medium text-sm">+221</span>
              </div>
              <input
                type="tel"
                value={form.phone}
                onChange={e => update('phone', e.target.value.replace(/[^\d\s]/g, ''))}
                placeholder="77 123 45 67"
                className="flex-1 h-12 bg-transparent outline-none px-4 text-sm"
              />
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Ouverture">
              <input
                type="time"
                value={form.openTime}
                onChange={e => update('openTime', e.target.value)}
                className="input-field"
              />
            </Field>
            <Field label="Fermeture">
              <input
                type="time"
                value={form.closeTime}
                onChange={e => update('closeTime', e.target.value)}
                className="input-field"
              />
            </Field>
          </div>
        </Section>

        {/* ── Section 4 : Livraison ──────────────────────────────────── */}
        <Section title="🛵 Paramètres de livraison">
          <div className="grid grid-cols-3 gap-3">
            <Field label="Frais (FCFA)">
              <input
                type="number"
                value={form.deliveryFee}
                onChange={e => update('deliveryFee', e.target.value)}
                className="input-field text-center"
                min="0"
              />
            </Field>
            <Field label="Rayon (km)">
              <input
                type="number"
                value={form.deliveryRadius}
                onChange={e => update('deliveryRadius', e.target.value)}
                className="input-field text-center"
                min="1"
              />
            </Field>
            <Field label="Prép. (min)">
              <input
                type="number"
                value={form.avgPrepTime}
                onChange={e => update('avgPrepTime', e.target.value)}
                className="input-field text-center"
                min="5"
              />
            </Field>
          </div>
          <p className="text-xs text-neutral-500 text-center">
            Frais · {form.deliveryFee} FCFA &nbsp;|&nbsp; Zone · {form.deliveryRadius} km &nbsp;|&nbsp; Préparation · ~{form.avgPrepTime} min
          </p>
        </Section>
      </div>

      {/* Submit */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-5 py-4 z-20 max-w-md mx-auto">
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full bg-[#7C3AED] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#7C3AED]/30 active:scale-[0.98] disabled:opacity-40 disabled:shadow-none flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          Créer ce local
        </button>
      </div>

      <style>{`
        .input-field { width: 100%; background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 0 14px; height: 48px; font-size: 14px; outline: none; color: #111827; }
        .input-field:focus { border-color: #7C3AED; }
      `}</style>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
    <h3 className="font-extrabold text-sm text-neutral-900 mb-1">{title}</h3>
    {children}
  </div>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="text-xs font-bold text-neutral-600 block mb-1.5">{label}</label>
    {children}
  </div>
);

export default OwnerCreateBranch;
