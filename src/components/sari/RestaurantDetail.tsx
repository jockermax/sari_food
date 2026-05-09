import React, { useState, useMemo, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { useAppContext } from '@/contexts/AppContext';
import {
  RESTAURANTS, getRestaurantMenu, MENU_CATEGORIES,
  CONDIMENTS, SUPPLEMENTS, formatPrice
} from '@/data/sariData';
import {
  ArrowLeft, Share2, Heart, Star, Clock, MapPin,
  X, Plus, Minus, ChevronRight
} from 'lucide-react';

// ─── Skeleton loader ──────────────────────────────────────────────────────────
const RestaurantSkeleton: React.FC = () => (
  <div className="min-h-screen bg-white">
    {/* Hero skeleton */}
    <div className="h-56 w-full bg-neutral-200 animate-pulse" />
    {/* Category tabs skeleton */}
    <div className="flex gap-3 px-5 py-3 border-b border-neutral-100 overflow-hidden">
      {[80, 64, 72, 56, 88, 60].map((w, i) => (
        <div key={i} className="flex-shrink-0 h-8 rounded-full bg-neutral-100 animate-pulse" style={{ width: w }} />
      ))}
    </div>
    {/* Items skeleton */}
    <div className="px-5 pt-5 space-y-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex gap-3 p-3 rounded-2xl border border-neutral-100">
          <div className="w-24 h-24 rounded-xl bg-neutral-100 animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-3 py-1">
            <div className="h-4 bg-neutral-100 rounded-full w-3/4 animate-pulse" />
            <div className="h-3 bg-neutral-100/70 rounded-full w-full animate-pulse" />
            <div className="h-3 bg-neutral-100/70 rounded-full w-2/3 animate-pulse" />
            <div className="flex justify-between items-center pt-1">
              <div className="h-4 bg-neutral-100 rounded-full w-20 animate-pulse" />
              <div className="w-9 h-9 rounded-xl bg-neutral-100 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Item Customization Modal ─────────────────────────────────────────────────
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
  const [openCondiments, setOpenCondiments] = useState(false);
  const [openSupplements, setOpenSupplements] = useState(false);

  const suppPrice = supplements.reduce((acc, suppLabel) => {
    const s = SUPPLEMENTS.find(x => x.label === suppLabel);
    return acc + (s?.price ?? 0);
  }, 0);
  const total = (item.price + suppPrice) * quantity;

  const toggleCondiment = (c: string) =>
    setCondiments(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  const toggleSupplement = (s: string) =>
    setSupplements(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md bg-white rounded-t-3xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
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
          <div className="flex items-center justify-between bg-neutral-50 rounded-2xl px-4 py-3">
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
          <div className="bg-neutral-50 rounded-2xl p-4">
            <button onClick={() => setOpenCondiments(!openCondiments)} className="w-full flex items-center justify-between outline-none">
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
              <div className="pt-4 space-y-2 border-t border-neutral-200 mt-4">
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
          <div className="bg-neutral-50 rounded-2xl p-4">
            <button onClick={() => setOpenSupplements(!openSupplements)} className="w-full flex items-center justify-between outline-none">
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
              <div className="pt-4 space-y-2 border-t border-neutral-200 mt-4">
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

// ─── Main Component ───────────────────────────────────────────────────────────
const RestaurantDetail: React.FC = () => {
  const { selectedRestaurantId, setScreen, cart, addToCart, toggleFavorite, isFavorite } = useAppContext();
  const [modalItem, setModalItem] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

  const restaurant = RESTAURANTS.find(r => r.id === selectedRestaurantId);
  const menu = useMemo(() => restaurant ? getRestaurantMenu(restaurant.id) : [], [restaurant]);

  // Only show categories that have items
  const activeCategories = useMemo(() =>
    MENU_CATEGORIES.filter(cat =>
      cat === 'Populaires'
        ? menu.some(m => m.popular)
        : menu.some(m => m.category === cat)
    ), [menu]);

  // Refs for each category section in the scrollable list
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const tabsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulate loading on mount
  useEffect(() => {
    const t = setTimeout(() => {
      setIsLoading(false);
      if (activeCategories.length > 0) setActiveCategory(activeCategories[0]);
    }, 900);
    return () => clearTimeout(t);
  }, [activeCategories]);

  // IntersectionObserver: auto-update active tab as user scrolls
  useEffect(() => {
    if (isLoading || isScrolling || !containerRef.current) return;
    const container = containerRef.current;
    const observers: IntersectionObserver[] = [];

    activeCategories.forEach(cat => {
      const el = sectionRefs.current[cat];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveCategory(cat);
            const tabEl = tabsRef.current?.querySelector(`[data-tab="${cat}"]`) as HTMLElement | null;
            tabEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        },
        { root: container, threshold: 0.25, rootMargin: '-52px 0px -55% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [isLoading, isScrolling, activeCategories]);

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

  // Scroll to a category section when tab is tapped
  const scrollToCategory = (cat: string) => {
    setActiveCategory(cat);
    setIsScrolling(true);
    const el = sectionRefs.current[cat];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Re-enable observer after scroll settles
    setTimeout(() => setIsScrolling(false), 800);
  };

  const getItemsForCategory = (cat: string) =>
    cat === 'Populaires'
      ? menu.filter(m => m.popular)
      : menu.filter(m => m.category === cat);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Keep back button visible during load */}
        <div className="relative">
          <RestaurantSkeleton />
          <button
            onClick={() => setScreen('restaurants')}
            className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-900" />
          </button>
        </div>
      </div>
    );
  }

  return (
    // h-screen + overflow-y-auto = own scroll container → sticky top-0 & sticky bottom-4 work correctly
    <div className="h-screen overflow-y-auto bg-[#FDF6EC]" ref={containerRef}>
      {/* Hero */}
      <div className="relative h-56 flex-shrink-0">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
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
              onClick={handleFavorite}
              className="w-10 h-10 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-lg active:scale-90 transition-transform"
            >
              <Heart className={`w-5 h-5 ${isFavorite(restaurant.id) ? 'text-[#FF4B11] fill-[#FF4B11]' : 'text-neutral-300'}`} />
            </button>
          </div>
        </div>
        <div className="absolute bottom-4 left-5 right-5">
          <h1 className="text-white font-black text-2xl leading-tight">{restaurant.name}</h1>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur px-2 py-1 rounded-lg">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-xs font-bold">{restaurant.rating} ({restaurant.reviews})</span>
            </div>
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur px-2 py-1 rounded-lg">
              <Clock className="w-3 h-3 text-white" />
              <span className="text-white text-xs font-bold">{restaurant.deliveryTime} min</span>
            </div>
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur px-2 py-1 rounded-lg">
              <MapPin className="w-3 h-3 text-white" />
              <span className="text-white text-xs font-bold">{restaurant.neighborhood}</span>
            </div>
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur px-2 py-1 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white text-xs font-bold">Ouvert</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky category tabs (stays within max-w-md container) ── */}
      <div className="sticky top-0 z-20 bg-white border-b border-neutral-100 shadow-sm">
        <div
          ref={tabsRef}
          className="flex gap-2 overflow-x-auto px-5 py-3 scrollbar-hide"
        >
          {activeCategories.map(cat => (
            <button
              key={cat}
              data-tab={cat}
              onClick={() => scrollToCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-[#FF4B11] text-white shadow-md shadow-[#FF4B11]/30 scale-105'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Scrollable full menu ── */}
      <div>
        {activeCategories.map(cat => {
          const items = getItemsForCategory(cat);
          if (items.length === 0) return null;
          return (
            <div
              key={cat}
              ref={el => { sectionRefs.current[cat] = el; }}
            >
              {/* Category title */}
              <div className="px-5 pt-6 pb-3 flex items-center gap-3">
                <div className="w-1 h-6 rounded-full bg-[#FF4B11]" />
                <h2 className="font-black text-neutral-900 text-base uppercase tracking-tight">{cat}</h2>
                <span className="text-xs text-neutral-400 font-bold bg-neutral-100 px-2 py-0.5 rounded-full">
                  {items.length} article{items.length > 1 ? 's' : ''}
                </span>
              </div>

              {/* Items */}
              <div className="px-5 space-y-3 pb-2">
                {items.map(item => {
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
                          <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#FF4B11] flex items-center justify-center shadow-md">
                            <span className="text-white text-[9px] font-black">{qty}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-neutral-900 mb-0.5">{item.name}</h3>
                        <p className="text-xs text-neutral-500 line-clamp-2 mb-2">{item.description}</p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="font-extrabold text-[#FF4B11]">{formatPrice(item.price)}</span>
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-all ${
                            qty > 0 ? 'bg-[#FF4B11] shadow-[#FF4B11]/30' : 'bg-[#FF4B11] shadow-[#FF4B11]/25'
                          }`}>
                            <Plus className="w-5 h-5 text-white stroke-[3]" />
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Divider between categories */}
              <div className="mx-5 mt-4 border-b border-neutral-100" />
            </div>
          );
        })}

        {/* Bottom spacer — ensures last items clear the floating cart pill */}
        <div className="h-24" />
      </div>

      {/* ── Cart CTA — compact floating pill ── */}
      {cartCount > 0 && (
        <div className="sticky bottom-4 z-30 flex justify-center px-5">
          <button
            onClick={() => setScreen('cart')}
            className="flex items-center gap-3 bg-[#FF4B11] text-white font-black py-3.5 px-5 rounded-full shadow-2xl shadow-[#FF4B11]/40 active:scale-[0.96] transition-all"
          >
            <div className="bg-white/25 w-7 h-7 rounded-full flex items-center justify-center text-sm font-black">
              {cartCount}
            </div>
            <span className="text-sm tracking-wide">Panier</span>
            <div className="w-px h-4 bg-white/30" />
            <span className="text-sm font-black">{formatPrice(cartTotal)}</span>
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
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default RestaurantDetail;
