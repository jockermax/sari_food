import React, { useState } from 'react';

import { useAppContext } from '@/contexts/AppContext';
import { formatPrice, RESTAURANTS } from '@/data/sariData';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Truck, 
  Store, 
  X, 
  Plus, 
  Minus, 
  Tag, 
  ChevronRight,
  Info
} from 'lucide-react';

const CartScreen: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, setScreen, selectedRestaurantId } = useAppContext();
  const [mode, setMode] = useState<'delivery' | 'pickup'>('delivery');
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const restaurant = RESTAURANTS.find(r => r.id === (selectedRestaurantId || cart[0]?.restaurantId));
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = mode === 'delivery' ? (restaurant?.deliveryFee || 500) : 0;
  const discount = promoApplied ? 500 : 0;
  const total = subtotal + deliveryFee - discount;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDF6EC] flex flex-col">
      <div className="bg-white sticky top-0 z-20 border-b border-neutral-100 shadow-sm px-5 py-4 flex items-center gap-3">
        <button
          onClick={() => setScreen('restaurants')}
          className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center active:scale-90 transition-all hover:bg-neutral-200"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-900" />
        </button>
        <h1 className="text-xl font-black text-neutral-900 leading-none">Panier</h1>
      </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-6 shadow-xl shadow-neutral-200">
            <ShoppingBag className="w-10 h-10 text-[#FF4B11]" />
          </div>
          <h2 className="text-xl font-extrabold text-neutral-900 mb-2">Panier vide</h2>
          <p className="text-sm text-neutral-500 mb-8 max-w-xs">
            Découvrez nos délicieux restaurants et ajoutez vos plats préférés
          </p>
          <button
            onClick={() => setScreen('restaurants')}
            className="bg-[#FF4B11] text-white font-extrabold px-10 py-4 rounded-2xl shadow-lg shadow-[#FF4B11]/30 active:scale-[0.98] transition-transform uppercase tracking-widest text-sm"
          >
            Parcourir les menus
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6EC] flex flex-col pb-10">
      <div className="bg-white sticky top-0 z-20 border-b border-neutral-100 shadow-sm px-5 py-4 flex items-center gap-3">
        <button
          onClick={() => setScreen('restaurant-detail')}
          className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center active:scale-90 transition-all hover:bg-neutral-200"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-900" />
        </button>
        <div>
          <h1 className="text-xl font-black text-neutral-900 leading-none">Panier</h1>
          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-1.5">{restaurant?.name}</p>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-4">
        {/* Mode selector */}
        <div className="bg-white rounded-[28px] p-1.5 flex shadow-sm border border-neutral-100">
          <button
            onClick={() => setMode('delivery')}
            className={`flex-1 py-3.5 rounded-[22px] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
              mode === 'delivery' ? 'bg-[#FF4B11] text-white shadow-lg shadow-[#FF4B11]/25' : 'text-neutral-400 hover:text-neutral-900'
            }`}
          >
            <Truck className="w-4 h-4" />
            Livraison
          </button>
          <button
            onClick={() => setMode('pickup')}
            className={`flex-1 py-3.5 rounded-[22px] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
              mode === 'pickup' ? 'bg-[#FF4B11] text-white shadow-lg shadow-[#FF4B11]/25' : 'text-neutral-400 hover:text-neutral-900'
            }`}
          >
            <Store className="w-4 h-4" />
            Emporter
          </button>
        </div>

        {/* Items */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-neutral-100 space-y-5">
          {cart.map(item => (
            <div key={item.id} className="flex gap-4 pb-5 border-b border-neutral-50 last:border-0 last:pb-0">
              <div className="w-20 h-20 rounded-[22px] overflow-hidden flex-shrink-0 shadow-sm">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-sm text-neutral-900 mb-0.5">{item.name}</h4>
                <p className="font-black text-[#FF4B11] text-base">{formatPrice(item.price)}</p>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1 bg-[#FDF6EC] rounded-2xl p-1 border border-[#FF4B11]/10">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-xl bg-white flex items-center justify-center active:scale-90 transition-transform shadow-sm"
                    >
                      <Minus className="w-3.5 h-3.5 text-[#FF4B11] stroke-[3]" />
                    </button>
                    <span className="font-black text-sm w-7 text-center text-neutral-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-xl bg-[#FF4B11] flex items-center justify-center active:scale-90 transition-transform shadow-md shadow-[#FF4B11]/20"
                    >
                      <Plus className="w-3.5 h-3.5 text-white stroke-[3]" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-8 h-8 rounded-full text-red-400 hover:text-red-500 active:scale-90 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Promo code */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-[#FF4B11]" />
            <h4 className="font-extrabold text-sm text-neutral-900 uppercase tracking-tight">Code promo</h4>
          </div>
          <div className="flex gap-2">
            <input
              value={promo}
              onChange={e => setPromo(e.target.value)}
              placeholder="Entrer votre code"
              className="flex-1 bg-[#FDF6EC] rounded-xl px-4 h-11 text-sm outline-none"
            />
            <button
              onClick={() => setPromoApplied(promo.length > 2)}
              className="bg-neutral-900 text-white px-6 rounded-xl text-xs font-extrabold uppercase tracking-widest active:scale-95 transition-transform"
            >
              Appliquer
            </button>
          </div>
          {promoApplied && (
            <p className="text-xs text-[#87C025] font-semibold mt-2">✓ Code appliqué : -500 FCFA</p>
          )}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Sous-total</span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">{mode === 'delivery' ? 'Livraison' : 'À emporter'}</span>
            <span className="font-semibold">{mode === 'delivery' ? formatPrice(deliveryFee) : 'Gratuit'}</span>
          </div>
          {promoApplied && (
            <div className="flex justify-between text-sm text-[#87C025]">
              <span>Réduction</span>
              <span className="font-semibold">-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="border-t border-neutral-100 pt-3 mt-1 flex justify-between items-center">
            <span className="font-extrabold text-neutral-900 uppercase tracking-widest text-xs">Total à payer</span>
            <span className="font-black text-xl text-[#FF4B11]">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <div className="flex-1" />
      <div className="sticky bottom-0 bg-white/80 backdrop-blur-lg border-t border-neutral-100 px-5 py-6 z-20 max-w-md mx-auto">
        <button
          onClick={() => setScreen('payment')}
          className="w-full bg-[#FF4B11] text-white font-black py-5 rounded-[24px] shadow-xl shadow-[#FF4B11]/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 px-7"
        >
          <span className="uppercase tracking-widest text-[12px]">Valider la commande</span>
          <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-base font-black">{formatPrice(total)}</span>
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default CartScreen;





