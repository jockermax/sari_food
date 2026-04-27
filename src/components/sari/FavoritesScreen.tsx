import React from 'react';
import { ArrowLeft, Heart, Star, Clock, MapPin, Trash2 } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { RESTAURANTS, formatPrice } from '@/data/sariData';

const FavoritesScreen: React.FC = () => {
  const { favorites, toggleFavorite, setScreen, setSelectedRestaurantId } = useAppContext();
  const favRestaurants = RESTAURANTS.filter(r => favorites.includes(r.id));

  const openRestaurant = (id: string) => {
    setSelectedRestaurantId(id);
    setScreen('restaurant-detail');
  };

  return (
    <div className="min-h-screen bg-[#FDF6EC] pb-6">
      <div className="bg-white sticky top-0 z-10 px-5 py-4 flex items-center gap-3 shadow-sm">
        <button
          onClick={() => setScreen('profile')}
          className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-700" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-neutral-900">Mes favoris</h1>
          <p className="text-xs text-neutral-500">
            {favRestaurants.length} restaurant{favRestaurants.length !== 1 ? 's' : ''} enregistré{favRestaurants.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#FDF6EC] flex items-center justify-center">
          <Heart className="w-5 h-5 text-[#C94A2A]" fill="#C94A2A" />
        </div>
      </div>

      {favRestaurants.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 text-center pt-20">
          <div className="relative mb-6">
            <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center shadow-md">
              <Heart className="w-14 h-14 text-[#C94A2A]" strokeWidth={1.5} />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#F4A012] flex items-center justify-center shadow-lg">
              <span className="text-white text-lg font-extrabold">+</span>
            </div>
          </div>
          <h2 className="text-xl font-extrabold text-neutral-900 mb-2">Aucun favori pour l'instant</h2>
          <p className="text-sm text-neutral-500 mb-8 max-w-xs leading-relaxed">
            Appuyez sur le cœur d'un restaurant pour le sauvegarder ici et le retrouver en un clin d'œil.
          </p>
          <button
            onClick={() => setScreen('restaurants')}
            className="bg-[#C94A2A] text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-[#C94A2A]/30 active:scale-[0.98]"
          >
            Découvrir les restaurants
          </button>
        </div>
      ) : (
        <div className="px-5 pt-5 space-y-4">
          {favRestaurants.map(r => (
            <div
              key={r.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => openRestaurant(r.id)}
                className="w-full text-left active:scale-[0.99] transition-transform"
              >
                <div className="relative h-36">
                  <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  {!r.isOpen && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-white text-neutral-900 px-4 py-1.5 rounded-full text-xs font-bold">
                        Fermé
                      </span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-[#F4A012]" fill="#F4A012" />
                    <span className="text-xs font-bold">{r.rating}</span>
                  </div>
                </div>
                <div className="p-4 pb-3">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-extrabold text-neutral-900 text-base">{r.name}</h3>
                    <span className="text-[11px] text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full font-semibold">
                      {r.distance}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mb-3">{r.cuisine}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1 text-neutral-600">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-semibold">{r.deliveryTime} min</span>
                    </div>
                    <div className="flex items-center gap-1 text-neutral-600">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="font-semibold">{r.neighborhood}</span>
                    </div>
                    <div className="ml-auto text-[#C94A2A] font-bold">
                      {formatPrice(r.deliveryFee)}
                    </div>
                  </div>
                </div>
              </button>
              <div className="px-4 pb-4 flex gap-2">
                <button
                  onClick={() => openRestaurant(r.id)}
                  className="flex-1 bg-[#C94A2A] text-white font-bold py-2.5 rounded-xl text-sm active:scale-[0.98]"
                >
                  Commander
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(r.id); }}
                  className="px-4 py-2.5 rounded-xl bg-red-50 text-red-500 font-bold text-sm flex items-center gap-1.5 active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                  Retirer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesScreen;
