import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { RESTAURANTS, formatPrice } from '@/data/sariData';
import { Skeleton } from '@/components/ui/Skeleton';
import { MapPin, Navigation2, Star, Clock } from 'lucide-react';

// Approximate coordinates for each city
const CITY_COORDS: Record<string, { lat: number; lng: number; defaultNeighborhood: string }> = {
  'Thiès':        { lat: 14.7926, lng: -16.9269, defaultNeighborhood: 'Thiès Centre' },
  'Dakar':        { lat: 14.6937, lng: -17.4441, defaultNeighborhood: 'Plateau' },
  'Mbour':        { lat: 14.3965, lng: -16.9626, defaultNeighborhood: 'Mbour Centre' },
  'Kaolack':      { lat: 14.1516, lng: -16.0726, defaultNeighborhood: 'Kaolack Centre' },
  'Saint-Louis':  { lat: 16.0179, lng: -16.4966, defaultNeighborhood: 'Sor' },
};

function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const FILTERS = ['Tous', 'Ouvert maintenant', 'Top noté', 'Livraison rapide', 'Frais offerts'];

const RestaurantList: React.FC = () => {
  const { location, setLocation, setScreen, setSelectedRestaurantId, toggleFavorite, isFavorite } = useAppContext();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Tous');
  const [isLoading, setIsLoading] = useState(true);
  const [geoStatus, setGeoStatus] = useState<'detecting' | 'found' | 'denied' | 'idle'>('idle');

  // Auto-geolocate on mount
  useEffect(() => {
    if (location) { setIsLoading(false); return; }

    if (!navigator.geolocation) {
      setGeoStatus('denied');
      setIsLoading(false);
      return;
    }

    setGeoStatus('detecting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // Find nearest city
        let nearest = '';
        let minDist = Infinity;
        for (const [city, coords] of Object.entries(CITY_COORDS)) {
          const d = haversine(latitude, longitude, coords.lat, coords.lng);
          if (d < minDist) { minDist = d; nearest = city; }
        }
        const cityInfo = CITY_COORDS[nearest];
        setLocation({ city: nearest, neighborhood: cityInfo.defaultNeighborhood });
        setGeoStatus('found');
        setIsLoading(false);
      },
      () => {
        // Permission denied or error — show all restaurants
        setGeoStatus('denied');
        setIsLoading(false);
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  }, []);

  const restaurants = useMemo(() => {
    let list = [...RESTAURANTS];
    
    // Sort so the ones in the same city are first
    if (location) {
      list.sort((a, b) => {
        if (a.city === location.city && b.city !== location.city) return -1;
        if (a.city !== location.city && b.city === location.city) return 1;
        return 0;
      });
    }

    if (search) {
      list = list.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filter === 'Ouvert maintenant') list = list.filter(r => r.isOpen);
    if (filter === 'Top noté') list = [...list].sort((a, b) => b.rating - a.rating);
    if (filter === 'Livraison rapide') list = [...list].sort((a, b) =>
      parseInt(a.deliveryTime) - parseInt(b.deliveryTime)
    );
    if (filter === 'Frais offerts') list = list.filter(r => r.deliveryFee === 0);
    return list;
  }, [location, search, filter]);

  const selectRestaurant = (id: string) => {
    setSelectedRestaurantId(id);
    setScreen('restaurant-detail');
  };

  return (
    <div className="min-h-screen bg-[#FDF6EC] pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="px-5 pt-5 pb-3">
          {/* Location indicator */}
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => setScreen('location')}
              className="flex items-center gap-3 text-left active:scale-95 transition-transform"
            >
              <div className="w-10 h-10 rounded-full bg-[#FDF6EC] flex items-center justify-center shadow-sm">
                {geoStatus === 'detecting'
                  ? <Navigation2 className="w-5 h-5 text-[#FF4B11] animate-pulse" />
                  : <MapPin className="w-5 h-5 text-[#FF4B11]" />
                }
              </div>
              <div>
                <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wide">
                  {geoStatus === 'detecting' ? 'Localisation...' : 'Livrer à (Changer)'}
                </div>
                <div className="text-sm font-extrabold text-neutral-900">
                  {geoStatus === 'detecting'
                    ? 'Détection en cours...'
                    : location
                      ? `${location.neighborhood}, ${location.city}`
                      : 'Tous les SARI'
                  }
                </div>
              </div>
            </button>
            {geoStatus === 'found' && (
              <span className="text-[10px] font-bold bg-green-100 text-green-700 px-3 py-1.5 rounded-full">
                📍 GPS actif
              </span>
            )}
            {geoStatus === 'denied' && (
              <button
                onClick={() => setScreen('location')}
                className="bg-[#FF4B11]/10 px-3 py-1.5 rounded-full border border-[#FF4B11]/20"
              >
                <span className="text-[10px] font-extrabold text-[#FF4B11]">CHOISIR</span>
              </button>
            )}
          </div>

          {/* Search */}
          <div className="bg-[#FDF6EC] rounded-2xl flex items-center px-4 h-12">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un restaurant ou un plat..."
              className="flex-1 bg-transparent outline-none px-3 text-sm"
            />
            <button className="px-3 py-1.5 rounded-lg bg-white text-[10px] font-bold text-[#FF4B11]">
              FILTRES
            </button>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto px-5 pb-3 scrollbar-hide">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setIsLoading(true); setTimeout(() => setIsLoading(false), 400); }}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                filter === f
                  ? 'bg-[#FF4B11] text-white shadow-md shadow-[#FF4B11]/25'
                  : 'bg-[#FDF6EC] text-neutral-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-extrabold text-neutral-900">
            {isLoading ? 'Recherche...' : `${restaurants.length} restaurant${restaurants.length > 1 ? 's' : ''}`}
          </h2>
          <span className="text-xs text-neutral-500 font-medium">
            {filter === 'Tous' ? 'Trié par pertinence' : `Filtré : ${filter}`}
          </span>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-100 mb-4">
                <div className="h-44 w-full bg-neutral-100/80 animate-pulse" />
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-neutral-100 rounded-full w-2/3 animate-pulse" />
                    <div className="h-5 bg-neutral-100 rounded-full w-12 animate-pulse" />
                  </div>
                  <div className="h-3 bg-neutral-100/60 rounded-full w-1/3 animate-pulse" />
                  <div className="flex gap-4 pt-2">
                    <div className="h-3 bg-neutral-100/60 rounded-full w-16 animate-pulse" />
                    <div className="h-3 bg-neutral-100/60 rounded-full w-16 animate-pulse" />
                    <div className="h-3 bg-neutral-100/60 rounded-full w-16 ml-auto animate-pulse" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            restaurants.map(r => {
              const fav = isFavorite(r.id);
              return (
                <button
                  key={r.id}
                  onClick={() => selectRestaurant(r.id)}
                  className="w-full bg-white rounded-2xl overflow-hidden shadow-sm active:scale-[0.99] transition-transform text-left"
                >
                  <div className="relative h-40">
                    <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    {!r.isOpen && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-white text-neutral-900 px-4 py-1.5 rounded-full text-xs font-bold">Fermé</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {r.tags.slice(0, 2).map(t => (
                        <span key={t} className="bg-white/95 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-bold text-neutral-900">{t}</span>
                      ))}
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <div
                        role="button" tabIndex={0}
                        onClick={e => { e.stopPropagation(); toggleFavorite(r.id); }}
                        onKeyDown={e => { if (e.key === 'Enter') { e.stopPropagation(); toggleFavorite(r.id); } }}
                        className="px-2.5 py-1.5 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-md active:scale-90 transition-transform cursor-pointer"
                      >
                        <span className={`text-[10px] font-extrabold ${fav ? 'text-[#FF4B11]' : 'text-neutral-500'}`}>
                          {fav ? '❤ FAVORI' : '♡ AJOUTER'}
                        </span>
                      </div>
                      <div className="bg-white/95 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1">
                        <Star className="w-3 h-3 text-[#FF4B11] fill-[#FF4B11]" />
                        <span className="text-xs font-bold">{r.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-extrabold text-neutral-900 text-base">{r.name}</h3>
                      <span className="text-[11px] text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full font-semibold">{r.distance}</span>
                    </div>
                    <p className="text-xs text-neutral-500 mb-3">{r.cuisine}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1 text-neutral-600">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="font-bold">{r.deliveryTime} min</span>
                      </div>
                      <div className="flex items-center gap-1 text-neutral-600">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="font-bold">{r.neighborhood}</span>
                      </div>
                      <div className="ml-auto text-[#FF4B11] font-bold">
                        {r.deliveryFee === 0 ? 'Livraison Offerte' : formatPrice(r.deliveryFee)}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}

          {!isLoading && restaurants.length === 0 && (
            <div className="bg-white rounded-2xl p-10 text-center">
              <div className="text-4xl mb-3">🍽️</div>
              <p className="font-bold text-neutral-900">Aucun restaurant trouvé</p>
              <p className="text-sm text-neutral-500 mt-1">Essayez une autre recherche ou filtre</p>
            </div>
          )}
        </div>
      </div>

      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  );
};

export default RestaurantList;
