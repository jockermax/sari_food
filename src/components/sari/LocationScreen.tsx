import React, { useState } from 'react';
import { ArrowLeft, MapPin, Navigation, Search, Check } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { CITIES } from '@/data/sariData';
import ProgressSteps from './ProgressSteps';

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
            className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-700" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-neutral-900">Où êtes-vous ?</h1>
            <p className="text-xs text-neutral-500">Choisissez votre zone de livraison</p>
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
              <div className="w-12 h-12 rounded-full bg-[#C94A2A] flex items-center justify-center shadow-xl animate-pulse">
                <MapPin className="w-6 h-6 text-white" fill="white" />
              </div>
              <div className="absolute inset-0 rounded-full bg-[#C94A2A]/30 animate-ping" />
            </div>
          </div>
          <button
            onClick={handleGeoLocate}
            className="absolute bottom-3 right-3 bg-white rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-lg font-semibold text-sm active:scale-95"
          >
            <Navigation className="w-4 h-4 text-[#C94A2A]" />
            Me localiser
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl flex items-center px-4 h-12 shadow-sm">
          <Search className="w-5 h-5 text-neutral-400" />
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
                className={`p-4 rounded-2xl border-2 transition-all text-left active:scale-[0.97] ${
                  selectedCity === c.name
                    ? 'bg-[#C94A2A] border-[#C94A2A] text-white shadow-lg shadow-[#C94A2A]/25'
                    : 'bg-white border-transparent text-neutral-900'
                }`}
              >
                <MapPin className={`w-5 h-5 mb-2 ${selectedCity === c.name ? 'text-white' : 'text-[#C94A2A]'}`} />
                <div className="font-bold text-sm">{c.name}</div>
                <div className={`text-[11px] mt-0.5 ${selectedCity === c.name ? 'text-white/80' : 'text-neutral-500'}`}>
                  {c.neighborhoods.length} quartiers
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
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      selectedNeighborhood === n ? 'bg-[#C94A2A]' : 'bg-neutral-100'
                    }`}>
                      <MapPin className={`w-4 h-4 ${selectedNeighborhood === n ? 'text-white' : 'text-neutral-500'}`} />
                    </div>
                    <span className={`font-semibold text-sm ${selectedNeighborhood === n ? 'text-[#C94A2A]' : 'text-neutral-900'}`}>
                      {n}
                    </span>
                  </div>
                  {selectedNeighborhood === n && (
                    <div className="w-6 h-6 rounded-full bg-[#C94A2A] flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
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
          className={`w-full font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
            selectedCity && selectedNeighborhood
              ? 'bg-[#C94A2A] text-white shadow-[#C94A2A]/30'
              : 'bg-neutral-200 text-neutral-400 shadow-none cursor-not-allowed'
          }`}
        >
          {selectedCity && selectedNeighborhood ? (
            <>
              Voir les restaurants
              <span className="opacity-80 font-medium text-sm">· {selectedNeighborhood}</span>
            </>
          ) : (
            'Choisissez votre zone'
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
