import React, { useState } from 'react';

import { useAppContext } from '@/contexts/AppContext';
import { CITIES } from '@/data/sariData';
import ProgressSteps from './ProgressSteps';
import { 
  ArrowLeft, 
  MapPin, 
  Search, 
  Navigation, 
  Map as MapIcon, 
  Check, 
  ChevronRight,
  Navigation2
} from 'lucide-react';

const LocationScreen: React.FC = () => {
  const { setScreen, setLocation } = useAppContext();
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('');
  const [search, setSearch] = useState('');

  const city = CITIES.find(c => c.name === selectedCity);
  const filteredCities = CITIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirm = () => {
    if (!selectedCity || !selectedNeighborhood) return;
    setLocation({ city: selectedCity, neighborhood: selectedNeighborhood });
    setScreen('restaurants');
  };

  const handleGeoLocate = () => {
    // Simulate auto-detect defaulting to Mbour
    setSelectedCity('Mbour');
    setSelectedNeighborhood('Mbour Centre');
  };

  return (
    <div className="min-h-screen bg-[#FDF6EC] flex flex-col pb-10">
      <div className="bg-white sticky top-0 z-10">
        <div className="px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => setScreen('onboarding')}
            className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-600" />
          </button>
          <div>
            <h1 className="text-lg font-extrabold text-neutral-900 uppercase tracking-tight leading-none">Où êtes-vous ?</h1>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Choisissez votre zone de livraison</p>
          </div>
        </div>
        <ProgressSteps current={1} />
      </div>

      <div className="px-5 pt-5 space-y-5">
        {/* Map preview */}
        <div className="relative rounded-2xl overflow-hidden h-44 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800"
            alt="Carte"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-[#FF4B11] flex items-center justify-center shadow-2xl shadow-[#FF4B11]/50 animate-pulse border-4 border-white/20">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div className="absolute inset-0 rounded-full bg-[#FF4B11]/40 animate-ping" />
            </div>
          </div>
          <button
            onClick={handleGeoLocate}
            className="absolute bottom-4 right-4 bg-white/95 backdrop-blur rounded-2xl px-5 py-3 flex items-center gap-2 shadow-xl font-extrabold text-xs uppercase tracking-widest text-neutral-900 active:scale-95 transition-transform border border-white/20"
          >
            <Navigation2 className="w-4 h-4 text-[#FF4B11] fill-[#FF4B11]" />
            Me localiser
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl flex items-center px-4 h-14 shadow-sm border border-neutral-100 group focus-within:border-[#FF4B11]/30 transition-all">
          <Search className="w-5 h-5 text-neutral-400 group-focus-within:text-[#FF4B11] transition-colors" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une ville..."
            className="flex-1 bg-transparent outline-none px-3 text-sm"
          />
        </div>

        {/* Cities */}
        <div>
          <h3 className="text-sm font-bold text-neutral-900 mb-3 px-1">Choisissez votre ville</h3>
          <div className="grid grid-cols-2 gap-3">
            {filteredCities.map(c => (
              <button
                key={c.name}
                onClick={() => { setSelectedCity(c.name); setSelectedNeighborhood(''); }}
                className={`p-5 rounded-3xl border-2 transition-all text-left active:scale-[0.97] flex flex-col gap-3 relative overflow-hidden group ${
                  selectedCity === c.name
                    ? 'bg-[#FF4B11] border-[#FF4B11] text-white shadow-xl shadow-[#FF4B11]/25'
                    : 'bg-white border-transparent text-neutral-900 hover:border-neutral-200'
                }`}
              >
                {selectedCity === c.name && (
                  <MapIcon className="absolute -right-4 -bottom-4 w-16 h-16 text-white/10" />
                )}
                <div className="w-10 h-10 rounded-2xl bg-neutral-100/50 flex items-center justify-center transition-colors group-hover:bg-neutral-100">
                  <MapIcon className={`w-5 h-5 ${selectedCity === c.name ? 'text-white' : 'text-neutral-500'}`} />
                </div>
                <div>
                  <div className="font-extrabold text-sm uppercase tracking-tight">{c.name}</div>
                  <div className={`text-[10px] font-bold mt-0.5 uppercase tracking-tighter ${selectedCity === c.name ? 'text-white/60' : 'text-neutral-400'}`}>
                    {c.neighborhoods.length} zones
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Neighborhoods */}
        {city && (
          <div className="animate-fade-in">
            <h3 className="text-sm font-bold text-neutral-900 mb-3 px-1">Choisissez votre quartier</h3>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {city.neighborhoods.map((n, i) => (
                <button
                  key={n}
                  onClick={() => setSelectedNeighborhood(n)}
                  className={`w-full flex items-center justify-between px-5 py-4 transition-colors ${
                    i !== 0 ? 'border-t border-neutral-100' : ''
                  } ${selectedNeighborhood === n ? 'bg-[#FDF6EC]' : 'active:bg-neutral-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                      selectedNeighborhood === n ? 'bg-[#FF4B11] text-white shadow-lg shadow-[#FF4B11]/30' : 'bg-neutral-100 text-neutral-400'
                    }`}>
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className={`font-extrabold text-sm ${selectedNeighborhood === n ? 'text-[#FF4B11]' : 'text-neutral-900'}`}>
                      {n}
                    </span>
                  </div>
                  {selectedNeighborhood === n && (
                    <div className="w-6 h-6 rounded-full bg-[#FF4B11] flex items-center justify-center shadow-md shadow-[#FF4B11]/30">
                      <Check className="text-white w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Spacer to push button down if content is short */}
      <div className="flex-1" />

      {/* Sticky confirm */}
      <div className="sticky bottom-0 bg-white border-t border-neutral-100 px-5 py-4 z-20">
        <button
          onClick={handleConfirm}
          disabled={!selectedCity || !selectedNeighborhood}
          className={`w-full font-extrabold py-5 rounded-3xl shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] uppercase tracking-widest text-sm ${
            selectedCity && selectedNeighborhood
              ? 'bg-[#FF4B11] text-white shadow-[#FF4B11]/30'
              : 'bg-neutral-200 text-neutral-400 shadow-none cursor-not-allowed'
          }`}
        >
          {selectedCity && selectedNeighborhood ? (
            <>
              Continuer
              <span className="opacity-60 font-medium normal-case tracking-normal">· {selectedNeighborhood}</span>
            </>
          ) : (
            'Sélectionnez votre zone'
          )}
        </button>
      </div>

      <style>{`
        @keyframes slide-up { from { transform: translateY(100%);} to { transform: translateY(0);} }
        @keyframes fade-in { from { opacity: 0; transform: translateY(8px);} to { opacity: 1; transform: translateY(0);} }
        .animate-slide-up { animation: slide-up 0.25s ease-out; }
        .animate-fade-in { animation: fade-in 0.25s ease-out; }
      `}</style>
    </div>
  );
};

export default LocationScreen;





