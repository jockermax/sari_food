import React, { useState, useMemo } from 'react';

import { toast } from 'sonner';
import { useAppContext } from '@/contexts/AppContext';
import { RESTAURANTS, getRestaurantMenu, MENU_CATEGORIES, formatPrice } from '@/data/sariData';
import { 
  ArrowLeft, 
  Share2, 
  Heart, 
  Star, 
  Clock, 
  MapPin, 
  Search, 
  X, 
  Plus, 
  Minus, 
  ShoppingBag 
} from 'lucide-react';

const RestaurantDetail: React.FC = () => {
  const { selectedRestaurantId, setScreen, cart, addToCart, updateQuantity, toggleFavorite, isFavorite } = useAppContext();
  const [activeCategory, setActiveCategory] = useState('Populaires');
  const [searchQuery, setSearchQuery] = useState('');


  const restaurant = RESTAURANTS.find(r => r.id === selectedRestaurantId);
  const menu = useMemo(() => restaurant ? getRestaurantMenu(restaurant.id) : [], [restaurant]);

  if (!restaurant) return null;

  const filteredMenu = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return menu.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.description?.toLowerCase().includes(q) ||
        m.category?.toLowerCase().includes(q)
      );
    }
    return activeCategory === 'Populaires'
      ? menu.filter(m => m.popular)
      : menu.filter(m => m.category === activeCategory);
  }, [menu, searchQuery, activeCategory]);

  const getQty = (id: string) => cart.find(c => c.id === id)?.quantity || 0;
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id, name: item.name, price: item.price,
      image: item.image, restaurantId: restaurant.id,
    });
    toast.success(`${item.name} ajouté au panier !`, {
      description: "Appuyez sur 'Voir le panier' pour finaliser.",
    });
  };

  const handleUpdateQty = (item: any, newQty: number) => {
    updateQuantity(item.id, newQty);
    if (newQty > getQty(item.id)) {
      toast.info(`Quantité mise à jour : ${newQty} × ${item.name}`);
    }
  };

  const handleFavorite = (id: string, name: string) => {
    toggleFavorite(id);
    if (!isFavorite(id)) {
      toast.success(`${name} ajouté aux favoris !`, {
        icon: '❤',
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pb-10">
      <div className="relative h-64">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        <div className="absolute top-4 left-0 right-0 px-5 flex items-center justify-between">
          <button
            onClick={() => setScreen('restaurants')}
            className="w-10 h-10 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-900" />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-lg active:scale-90 transition-transform">
              <Share2 className="w-5 h-5 text-neutral-900" />
            </button>
            <button
              onClick={() => handleFavorite(restaurant.id, restaurant.name)}
              aria-label={isFavorite(restaurant.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              className="w-10 h-10 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-lg active:scale-90 transition-transform"
            >
              <Heart className={`w-5 h-5 ${isFavorite(restaurant.id) ? 'text-[#FF4B11] fill-[#FF4B11]' : 'text-neutral-300'}`} />
            </button>

          </div>
        </div>
      </div>

      <div className="relative -mt-6 bg-white rounded-t-3xl p-5">
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-2xl font-extrabold text-neutral-900">{restaurant.name}</h1>
          <div className="flex items-center gap-1.5 bg-[#FF4B11]/5 px-3 py-1.5 rounded-xl border border-[#FF4B11]/10">
            <Star className="w-3.5 h-3.5 text-[#FF4B11] fill-[#FF4B11]" />
            <span className="font-extrabold text-sm text-[#FF4B11]">{restaurant.rating}</span>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-tight">({restaurant.reviews})</span>
          </div>
        </div>
        <p className="text-sm text-neutral-500 mb-4">{restaurant.cuisine}</p>

        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 text-neutral-700">
            <Clock className="w-4 h-4 text-neutral-400" />
            <span className="text-xs font-extrabold">{restaurant.deliveryTime} min</span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-700">
            <MapPin className="w-4 h-4 text-neutral-400" />
            <span className="text-xs font-extrabold">{restaurant.neighborhood}</span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-700">
            <div className="w-2 h-2 rounded-full bg-[#87C025] animate-pulse" />
            <span className="text-xs font-extrabold text-[#87C025] uppercase tracking-wider">Ouvert</span>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-10 bg-white border-b border-neutral-100">
        <div className="flex gap-2 overflow-x-auto px-5 py-3 scrollbar-hide">
          {MENU_CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === c
                  ? 'bg-[#FF4B11] text-white shadow-md shadow-[#FF4B11]/25'
                  : 'bg-[#FDF6EC] text-neutral-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Search bar */}
      <div className="px-5 pt-4 pb-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher un plat, une pâtisserie..."
            className="w-full bg-[#FDF6EC] rounded-xl pl-9 pr-9 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none border border-neutral-100 focus:border-[#FF4B11] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center active:scale-90"
            >
              <X className="w-4 h-4 text-neutral-400" />
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-xs text-neutral-500 mt-1.5 px-1">{filteredMenu.length} résultat(s) pour « {searchQuery} »</p>
        )}
      </div>

      <div className="px-5 pt-4 space-y-3">
        {filteredMenu.map(item => {
          const qty = getQty(item.id);
          return (
            <div key={item.id} className="flex gap-3 bg-white rounded-2xl p-3 shadow-sm border border-neutral-100">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                {item.popular && (
                  <div className="absolute top-1 left-1 bg-[#FF4B11] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    TOP
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-neutral-900 mb-0.5">{item.name}</h3>
                <p className="text-xs text-neutral-500 line-clamp-2 mb-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#FF4B11]">{formatPrice(item.price)}</span>
                  {qty === 0 ? (
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-10 h-10 rounded-2xl bg-[#FF4B11] text-white flex items-center justify-center shadow-lg shadow-[#FF4B11]/25 active:scale-95 transition-transform"
                    >
                      <Plus className="w-6 h-6 stroke-[3]" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 bg-[#FDF6EC] rounded-2xl p-1 border border-[#FF4B11]/10">
                      <button
                        onClick={() => handleUpdateQty(item, qty - 1)}
                        className="w-8 h-8 rounded-xl bg-white flex items-center justify-center active:scale-90 transition-transform shadow-sm"
                      >
                        <Minus className="w-4 h-4 text-[#FF4B11] stroke-[3]" />
                      </button>
                      <span className="font-extrabold text-sm w-7 text-center text-neutral-900">{qty}</span>
                      <button
                        onClick={() => handleUpdateQty(item, qty + 1)}
                        className="w-8 h-8 rounded-xl bg-[#FF4B11] flex items-center justify-center active:scale-90 transition-transform shadow-md shadow-[#FF4B11]/20"
                      >
                        <Plus className="w-4 h-4 text-white stroke-[3]" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredMenu.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
            <p className="font-extrabold text-neutral-900 uppercase tracking-widest text-sm">{searchQuery ? 'Aucun résultat' : 'Bientôt disponible'}</p>
            <p className="text-xs text-neutral-500 mt-2 font-medium px-10">
              {searchQuery ? `Aucun plat correspondant à « ${searchQuery} »` : 'Ce restaurant n\'a pas encore d\'articles dans cette catégorie.'}
            </p>
          </div>
        )}
      </div>

      <div className="flex-1" />
      {cartCount > 0 && (
        <div className="sticky bottom-0 bg-white border-t border-neutral-100 px-5 py-4 z-20">
          <button
            onClick={() => setScreen('cart')}
            className="w-full bg-[#FF4B11] text-white font-extrabold py-4 rounded-2xl shadow-lg shadow-[#FF4B11]/30 active:scale-[0.98] transition-transform flex items-center justify-between px-6"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black">
                {cartCount}
              </div>
              <span className="uppercase tracking-widest text-sm">Voir le panier</span>
            </div>
            <span className="text-lg font-black">{formatPrice(cartTotal)}</span>
          </button>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
};

export default RestaurantDetail;





