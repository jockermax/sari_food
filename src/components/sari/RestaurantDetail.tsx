import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useAppContext } from '@/contexts/AppContext';
import {
  RESTAURANTS, getRestaurantMenu, MENU_CATEGORIES,
  MENU_CATEGORY_IMAGES, CONDIMENTS, SUPPLEMENTS, formatPrice
} from '@/data/sariData';
import {
  ArrowLeft, Share2, Heart, Star, Clock, MapPin,
  X, Plus, Minus, ChevronRight, ShoppingBag
} from 'lucide-react';

// ─── Sub-component: Item Customization Modal ────────────────────────────────
interface ModalProps {
  item: any;
  restaurantId: string;
  onClose: () => void;
  onAdd: (item: any, qty: number, condiments: string[], supplements: string[], supplementPrice: number) => void;
}

const ItemModal: React.FC<ModalProps> = ({ item, onClose, onAdd }) => {
  const [quantity, setQuantity] = useState(1);
  const [condiments, setCondiments] = useState<string[]>([]);
  const [supplements, setSupplements] = useState<string[]>([]);
  
  // States for dropdowns
  const [openCondiments, setOpenCondiments] = useState(false);
  const [openSupplements, setOpenSupplements] = useState(false);

  const suppPrice = supplements.reduce((acc, suppLabel) => {
    const s = SUPPLEMENTS.find(x => x.label === suppLabel);
    return acc + (s?.price ?? 0);
  }, 0);
  const total = (item.price + suppPrice) * quantity;

  const toggleCondiment = (c: string) => {
    setCondiments(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };
  
  const toggleSupplement = (s: string) => {
    setSupplements(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md bg-white rounded-t-3xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Image banner */}
        <div className="relative h-44 w-full flex-shrink-0">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-lg"
          >
            <X className="w-4 h-4 text-neutral-900" />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-white font-black text-xl leading-tight">{item.name}</h2>
            <p className="text-white/70 text-xs mt-0.5 font-medium">{item.description}</p>
          </div>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Quantité */}
          <div className="flex items-center justify-between bg-neutral-50 rounded-2xl px-4 py-3 flex-shrink-0">
            <span className="font-bold text-neutral-700 text-sm">Quantité</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-xl bg-white border border-neutral-200 flex items-center justify-center active:scale-90 transition-transform shadow-sm"
              >
                <Minus className="w-4 h-4 text-[#FF4B11] stroke-[2.5]" />
              </button>
              <span className="font-black text-neutral-900 w-5 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(10, q + 1))}
                className="w-8 h-8 rounded-xl bg-[#FF4B11] flex items-center justify-center active:scale-90 transition-transform shadow-md shadow-[#FF4B11]/30"
              >
                <Plus className="w-4 h-4 text-white stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Condiments */}
          <div className="bg-neutral-50 rounded-2xl p-4 flex-shrink-0 transition-all">
            <button 
              onClick={() => setOpenCondiments(!openCondiments)}
              className="w-full flex items-center justify-between outline-none"
            >
              <div className="flex flex-col items-start text-left">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-700 text-sm">Condiments</span>
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider bg-white px-1.5 py-0.5 rounded shadow-sm border border-neutral-100">Optionnel</span>
                </div>
                <span className="text-xs text-neutral-500 mt-1 line-clamp-1">
                  {condiments.length === 0 ? 'Aucun sélectionné' : condiments.join(', ')}
                </span>
              </div>
              <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm border border-neutral-100 flex-shrink-0 ml-3">
                <ChevronRight className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${openCondiments ? 'rotate-90' : ''}`} />
              </div>
            </button>
            
            {openCondiments && (
              <div className="pt-4 space-y-2 border-t border-neutral-200 mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                {CONDIMENTS.filter(c => c !== 'Aucun').map(c => (
                  <label key={c} className="flex items-center justify-between p-3 rounded-xl bg-white border border-neutral-100 cursor-pointer active:scale-[0.98] transition-transform shadow-sm">
                    <span className="text-sm font-semibold text-neutral-800">{c}</span>
                    <input type="checkbox" checked={condiments.includes(c)} onChange={() => toggleCondiment(c)} className="w-5 h-5 rounded border-neutral-300 text-[#FF4B11] focus:ring-[#FF4B11]" />
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Suppléments */}
          <div className="bg-neutral-50 rounded-2xl p-4 flex-shrink-0 transition-all">
            <button 
              onClick={() => setOpenSupplements(!openSupplements)}
              className="w-full flex items-center justify-between outline-none"
            >
              <div className="flex flex-col items-start text-left">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-700 text-sm">Suppléments</span>
                  {suppPrice > 0 && (
                    <span className="text-[10px] font-bold text-[#FF4B11] bg-[#FF4B11]/10 px-2 py-0.5 rounded-full">
                      +{formatPrice(suppPrice)}
                    </span>
                  )}
                </div>
                <span className="text-xs text-neutral-500 mt-1 line-clamp-1">
                  {supplements.length === 0 ? 'Aucun sélectionné' : supplements.join(', ')}
                </span>
              </div>
              <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm border border-neutral-100 flex-shrink-0 ml-3">
                <ChevronRight className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${openSupplements ? 'rotate-90' : ''}`} />
              </div>
            </button>

            {openSupplements && (
              <div className="pt-4 space-y-2 border-t border-neutral-200 mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                {SUPPLEMENTS.filter(s => s.label !== 'Aucun').map(s => (
                  <label key={s.label} className="flex items-center justify-between p-3 rounded-xl bg-white border border-neutral-100 cursor-pointer active:scale-[0.98] transition-transform shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-neutral-800">{s.label}</span>
                      {s.price > 0 && <span className="text-xs font-bold text-[#FF4B11]">+{formatPrice(s.price)}</span>}
                    </div>
                    <input type="checkbox" checked={supplements.includes(s.label)} onChange={() => toggleSupplement(s.label)} className="w-5 h-5 rounded border-neutral-300 text-[#FF4B11] focus:ring-[#FF4B11]" />
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="p-5 bg-white border-t border-neutral-100 flex-shrink-0">
          <button
            onClick={() => onAdd(item, quantity, condiments, supplements, suppPrice)}
            className="w-full bg-[#FF4B11] text-white font-extrabold py-4 rounded-2xl shadow-lg shadow-[#FF4B11]/30 active:scale-[0.98] transition-transform flex items-center justify-between px-6"
          >
            <span className="uppercase tracking-wider text-sm">Ajouter</span>
            <span className="font-black text-lg">{formatPrice(total)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const RestaurantDetail: React.FC = () => {
  const { selectedRestaurantId, setScreen, cart, addToCart, toggleFavorite, isFavorite } = useAppContext();

  const [view, setView] = useState<'categories' | 'items'>('categories');
  const [selectedCategory, setSelectedCategory] = useState('Burgers');
  const [modalItem, setModalItem] = useState<any>(null);

  const restaurant = RESTAURANTS.find(r => r.id === selectedRestaurantId);
  const menu = useMemo(() => restaurant ? getRestaurantMenu(restaurant.id) : [], [restaurant]);

  const categoryItems = useMemo(() =>
    selectedCategory === 'Populaires'
      ? menu.filter(m => m.popular)
      : menu.filter(m => m.category === selectedCategory),
    [menu, selectedCategory]
  );

  if (!restaurant) return null;

  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const getQty = (id: string) => cart.reduce((s, i) => i.id.startsWith(id) ? s + i.quantity : s, 0);

  const handleAdd = (item: any, qty: number, condiments: string[], supplements: string[], suppPrice: number) => {
    const condimentStr = condiments.length > 0 ? condiments.join(', ') : 'Aucun';
    const supplementStr = supplements.length > 0 ? supplements.join(', ') : 'Aucun';
    const suffix = [condiments.length > 0 ? condiments.join(', ') : '', supplements.length > 0 ? supplements.join(', ') : ''].filter(Boolean).join(' + ');
    const cartId = `${item.id}_${condiments.sort().join('-')}_${supplements.sort().join('-')}`;
    
    addToCart({
      id: cartId,
      name: suffix ? `${item.name} (${suffix})` : item.name,
      price: item.price + suppPrice,
      image: item.image,
      restaurantId: restaurant.id,
      condiment: condimentStr,
      supplement: supplementStr,
    }, qty);
    toast.success(`${item.name} ajouté !`, {
      description: suffix ? `Avec : ${suffix}` : "Appuyez sur 'Voir le panier' pour finaliser.",
    });
    setModalItem(null);
  };

  const handleFavorite = () => {
    toggleFavorite(restaurant.id);
    if (!isFavorite(restaurant.id)) toast.success(`${restaurant.name} ajouté aux favoris !`, { icon: '❤' });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pb-10">
      {/* Hero image */}
      <div className="relative h-56">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <div className="absolute top-4 left-0 right-0 px-5 flex items-center justify-between">
          <button
            onClick={() => view === 'items' ? setView('categories') : setScreen('restaurants')}
            className="w-10 h-10 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-900" />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-lg active:scale-90 transition-transform">
              <Share2 className="w-5 h-5 text-neutral-900" />
            </button>
            <button
              onClick={handleFavorite}
              className="w-10 h-10 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-lg active:scale-90 transition-transform"
            >
              <Heart className={`w-5 h-5 ${isFavorite(restaurant.id) ? 'text-[#FF4B11] fill-[#FF4B11]' : 'text-neutral-300'}`} />
            </button>
          </div>
        </div>
        {/* Restaurant info overlay */}
        <div className="absolute bottom-4 left-5 right-5">
          <h1 className="text-white font-black text-2xl leading-tight">{restaurant.name}</h1>
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur px-2 py-1 rounded-lg">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-xs font-bold">{restaurant.rating} ({restaurant.reviews})</span>
            </div>
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur px-2 py-1 rounded-lg">
              <Clock className="w-3 h-3 text-white" />
              <span className="text-white text-xs font-bold">{restaurant.deliveryTime} min</span>
            </div>
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur px-2 py-1 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white text-xs font-bold">Ouvert</span>
            </div>
          </div>
        </div>
      </div>

      {/* View: Category Grid */}
      {view === 'categories' && (
        <div className="flex-1 p-5">
          <h2 className="text-lg font-black text-neutral-900 mb-1 uppercase tracking-tight">Notre Menu</h2>
          <p className="text-xs text-neutral-400 font-semibold mb-5">Choisissez une catégorie</p>

          <div className="grid grid-cols-2 gap-3">
            {MENU_CATEGORIES.map(cat => {
              const img = MENU_CATEGORY_IMAGES[cat] || restaurant.image;
              const count = cat === 'Populaires'
                ? menu.filter(m => m.popular).length
                : menu.filter(m => m.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setView('items'); }}
                  className="relative h-36 rounded-3xl overflow-hidden active:scale-[0.97] transition-transform shadow-md"
                >
                  <img src={img} alt={cat} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-3">
                    <span className="text-white font-black text-base leading-tight">{cat}</span>
                    <span className="text-white/60 text-[10px] font-bold mt-0.5">{count} article{count > 1 ? 's' : ''}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* View: Items in Category */}
      {view === 'items' && (
        <div className="flex-1">
          {/* Category header */}
          <div className="sticky top-0 z-10 bg-white border-b border-neutral-100 px-5 py-3 flex items-center gap-3">
            <button
              onClick={() => setView('categories')}
              className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center active:scale-90 transition-transform"
            >
              <ArrowLeft className="w-4 h-4 text-neutral-700" />
            </button>
            <div>
              <h2 className="font-black text-neutral-900 uppercase tracking-tight">{selectedCategory}</h2>
              <p className="text-[10px] text-neutral-400 font-bold">{categoryItems.length} article{categoryItems.length > 1 ? 's' : ''}</p>
            </div>
          </div>

          <div className="px-5 pt-4 space-y-3">
            {categoryItems.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-3">🍽️</div>
                <p className="font-bold text-neutral-700">Bientôt disponible</p>
              </div>
            ) : (
              categoryItems.map(item => {
                const qty = getQty(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => setModalItem(item)}
                    className="w-full flex gap-3 bg-white rounded-2xl p-3 shadow-sm border border-neutral-100 active:scale-[0.99] transition-transform text-left"
                  >
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      {item.popular && (
                        <div className="absolute top-1 left-1 bg-[#FF4B11] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          TOP
                        </div>
                      )}
                      {qty > 0 && (
                        <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#FF4B11] flex items-center justify-center">
                          <span className="text-white text-[9px] font-black">{qty}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-neutral-900 mb-0.5">{item.name}</h3>
                      <p className="text-xs text-neutral-500 line-clamp-2 mb-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[#FF4B11]">{formatPrice(item.price)}</span>
                        <div className="w-9 h-9 rounded-xl bg-[#FF4B11] flex items-center justify-center shadow-md shadow-[#FF4B11]/25">
                          <Plus className="w-5 h-5 text-white stroke-[3]" />
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Cart CTA */}
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

      {/* Modal */}
      {modalItem && (
        <ItemModal
          item={modalItem}
          restaurantId={restaurant.id}
          onClose={() => setModalItem(null)}
          onAdd={handleAdd}
        />
      )}

      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
};

export default RestaurantDetail;
