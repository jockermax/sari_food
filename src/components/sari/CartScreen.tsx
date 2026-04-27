import React, { useState } from 'react';
import { ArrowLeft, Plus, Minus, Trash2, Tag, ShoppingBag, Home, Store } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { formatPrice, RESTAURANTS } from '@/data/sariData';

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
        <div className="bg-white px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => setScreen('restaurants')}
            className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Panier</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-5 shadow-md">
            <ShoppingBag className="w-12 h-12 text-[#C94A2A]" />
          </div>
          <h2 className="text-xl font-extrabold text-neutral-900 mb-2">Panier vide</h2>
          <p className="text-sm text-neutral-500 mb-8 max-w-xs">
            Découvrez nos délicieux restaurants et ajoutez vos plats préférés
          </p>
          <button
            onClick={() => setScreen('restaurants')}
            className="bg-[#C94A2A] text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-[#C94A2A]/30 active:scale-[0.98]"
          >
            Parcourir les restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6EC] flex flex-col pb-10">
      <div className="bg-white sticky top-0 z-10 px-5 py-4 flex items-center gap-3 shadow-sm">
        <button
          onClick={() => setScreen('restaurant-detail')}
          className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold">Votre panier</h1>
          <p className="text-xs text-neutral-500">{restaurant?.name}</p>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-4">
        {/* Mode selector */}
        <div className="bg-white rounded-2xl p-1.5 flex shadow-sm">
          <button
            onClick={() => setMode('delivery')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              mode === 'delivery' ? 'bg-[#C94A2A] text-white shadow-md' : 'text-neutral-600'
            }`}
          >
            <Home className="w-4 h-4" />
            Livraison
          </button>
          <button
            onClick={() => setMode('pickup')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              mode === 'pickup' ? 'bg-[#C94A2A] text-white shadow-md' : 'text-neutral-600'
            }`}
          >
            <Store className="w-4 h-4" />
            À emporter
          </button>
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          {cart.map(item => (
            <div key={item.id} className="flex gap-3 pb-3 border-b border-neutral-100 last:border-0 last:pb-0">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-neutral-900">{item.name}</h4>
                <p className="text-[#C94A2A] font-bold text-sm mt-1">{formatPrice(item.price)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-neutral-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1 bg-[#FDF6EC] rounded-lg p-0.5">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-md bg-white flex items-center justify-center"
                  >
                    <Minus className="w-3 h-3 text-[#C94A2A]" />
                  </button>
                  <span className="font-bold text-xs w-5 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-md bg-[#C94A2A] flex items-center justify-center"
                  >
                    <Plus className="w-3 h-3 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Promo code */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-4 h-4 text-[#F4A012]" />
            <h4 className="font-bold text-sm">Code promo</h4>
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
              className="bg-neutral-900 text-white px-5 rounded-xl text-sm font-bold active:scale-95"
            >
              Appliquer
            </button>
          </div>
          {promoApplied && (
            <p className="text-xs text-green-600 font-semibold mt-2">✓ Code appliqué : -500 FCFA</p>
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
            <div className="flex justify-between text-sm text-green-600">
              <span>Réduction</span>
              <span className="font-semibold">-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="border-t border-neutral-100 pt-2 mt-2 flex justify-between">
            <span className="font-bold text-neutral-900">Total</span>
            <span className="font-extrabold text-lg text-[#C94A2A]">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <div className="flex-1" />
      <div className="sticky bottom-0 bg-white border-t border-neutral-100 px-5 py-4 z-20">
        <button
          onClick={() => setScreen('payment')}
          className="w-full bg-[#C94A2A] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#C94A2A]/30 active:scale-[0.98] flex items-center justify-between px-6"
        >
          <span>Continuer</span>
          <span>{formatPrice(total)}</span>
        </button>
      </div>
    </div>
  );
};

export default CartScreen;
