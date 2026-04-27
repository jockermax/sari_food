import React, { useState } from 'react';
import { ArrowLeft, Check, MapPin } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { formatPrice, RESTAURANTS } from '@/data/sariData';
import ProgressSteps from './ProgressSteps';

const PAYMENT_METHODS = [
  { id: 'wave', name: 'Wave', logo: 'https://play-lh.googleusercontent.com/HW0p9UHBcXAX1J1xI-r3ldQRDOq7gAh4h3iGWc9rDkNAEFTCQhJ9bHtWXW8NhLUWAYI', color: '#1DC8F3' },
  { id: 'orange', name: 'Orange Money', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/1200px-Orange_logo.svg.png', color: '#FF7900' },
  { id: 'free', name: 'Free Money', logo: 'https://www.free.sn/assets/images/logo.png', color: '#CD0A66' },
  { id: 'cash', name: 'Paiement à la livraison', logo: '', color: '#16a34a', isCash: true },
];

const PaymentScreen: React.FC = () => {
  const { cart, setScreen, clearCart, setCurrentOrder, location, phone, setPhone } = useAppContext();
  const [method, setMethod] = useState('wave');
  const [address, setAddress] = useState('');
  const [processing, setProcessing] = useState(false);

  const { selectedRestaurantId } = useAppContext();
  const restaurant = RESTAURANTS.find(r => r.id === (selectedRestaurantId || cart[0]?.restaurantId));
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = restaurant?.deliveryFee || 500;
  const total = subtotal + deliveryFee;

  const handlePay = () => {
    if (!phone || phone.length < 9) return;
    setProcessing(true);
    setTimeout(() => {
      const order = {
        id: `SARI${Date.now().toString().slice(-6)}`,
        items: cart,
        total,
        method,
        restaurant,
        address,
        phone,
        location,
        status: 'received',
        createdAt: new Date(),
      };
      setCurrentOrder(order);
      clearCart();
      setScreen('tracking');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FDF6EC] flex flex-col pb-10">
      <div className="bg-white sticky top-0 z-10">
        <div className="px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => setScreen('cart')}
            className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Paiement</h1>
        </div>
        <ProgressSteps current={3} />
      </div>

      <div className="px-5 pt-5 space-y-4">
        {/* Delivery address */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-[#C94A2A]" />
            <h4 className="font-bold text-sm">Adresse de livraison</h4>
          </div>
          <div className="bg-[#FDF6EC] rounded-xl p-3 mb-2">
            <p className="text-xs text-neutral-500 font-semibold uppercase">Zone</p>
            <p className="font-bold text-sm text-neutral-900">{location?.neighborhood}, {location?.city}</p>
          </div>
          <input
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Détails (rue, immeuble, étage, repère...)"
            className="w-full bg-[#FDF6EC] rounded-xl px-4 h-11 text-sm outline-none mb-3"
          />
          <div className="bg-[#FDF6EC] rounded-xl p-3">
            <p className="text-xs text-neutral-500 font-semibold uppercase mb-1.5">Téléphone (pour le livreur)</p>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Ex: 77 123 45 67"
              className="w-full bg-white rounded-lg px-3 h-10 text-sm outline-none border border-neutral-200 focus:border-[#C94A2A]"
            />
          </div>
        </div>

        {/* Payment method */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h4 className="font-bold text-sm mb-3">Mode de paiement</h4>
          <div className="space-y-2">
            {PAYMENT_METHODS.map(m => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  method === m.id
                    ? 'border-[#C94A2A] bg-[#FDF6EC]'
                    : 'border-neutral-100 bg-white'
                }`}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                  style={{ backgroundColor: m.isCash ? m.color : `${m.color}15` }}
                >
                  {m.isCash ? (
                    <span className="text-white font-extrabold text-lg">₣</span>
                  ) : (
                    <span className="font-extrabold text-sm" style={{ color: m.color }}>
                      {m.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-sm text-neutral-900">{m.name}</p>
                  <p className="text-xs text-neutral-500">
                    {m.isCash ? 'Payez en espèces au livreur' : `Paiement via ${m.name}`}
                  </p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  method === m.id ? 'border-[#C94A2A] bg-[#C94A2A]' : 'border-neutral-300'
                }`}>
                  {method === m.id && <Check className="w-3 h-3 text-white" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
          <h4 className="font-bold text-sm mb-2">Résumé</h4>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">{cart.length} article{cart.length > 1 ? 's' : ''}</span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Frais de livraison</span>
            <span className="font-semibold">{formatPrice(deliveryFee)}</span>
          </div>
          <div className="border-t border-neutral-100 pt-2 mt-2 flex justify-between">
            <span className="font-bold">Total à payer</span>
            <span className="font-extrabold text-lg text-[#C94A2A]">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <div className="flex-1" />
      <div className="sticky bottom-0 bg-white border-t border-neutral-100 px-5 py-4 z-20">
        <button
          onClick={handlePay}
          disabled={processing || !phone || phone.length < 9}
          className="w-full bg-[#C94A2A] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#C94A2A]/30 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Paiement en cours...
            </>
          ) : (
            <>Payer {formatPrice(total)}</>
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentScreen;
