import React, { useState } from 'react';

import { useAppContext } from '@/contexts/AppContext';
import { formatPrice, RESTAURANTS } from '@/data/sariData';
import ProgressSteps from './ProgressSteps';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  CreditCard, 
  Wallet, 
  CheckCircle2, 
  Truck,
  DollarSign,
  Smartphone
} from 'lucide-react';

const PAYMENT_METHODS = [
  { id: 'wave', name: 'Wave', logo: 'https://play-lh.googleusercontent.com/HW0p9UHBcXAX1J1xI-r3ldQRDOq7gAh4h3iGWc9rDkNAEFTCQhJ9bHtWXW8NhLUWAYI', color: '#1DC8F3', icon: Wallet },
  { id: 'orange', name: 'Orange Money', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/1200px-Orange_logo.svg.png', color: '#FF7900', icon: Smartphone },
  { id: 'free', name: 'Free Money', logo: 'https://www.free.sn/assets/images/logo.png', color: '#CD0A66', icon: Smartphone },
  { id: 'cash', name: 'Espèces', logo: '', color: '#87C025', isCash: true, icon: DollarSign },
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
      <div className="bg-white sticky top-0 z-20 border-b border-neutral-100 shadow-sm">
        <div className="px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => setScreen('cart')}
            className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center active:scale-90 transition-all hover:bg-neutral-200"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-900" />
          </button>
          <h1 className="text-xl font-black text-neutral-900 leading-none">Paiement</h1>
        </div>
        <ProgressSteps current={3} />
      </div>
      </div>

      <div className="px-5 pt-5 space-y-4">
        {/* Delivery address */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-neutral-100 space-y-6">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-neutral-400" />
            <h3 className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em]">Détails de livraison</h3>
          </div>
          
          <div className="space-y-5">
            <div className="bg-neutral-50 rounded-[24px] p-4 border border-neutral-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#FF4B11]" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none">Zone actuelle</p>
                  <p className="font-bold text-sm text-neutral-900 mt-1">{location?.neighborhood}, {location?.city}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 block ml-1">Complément d'adresse</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                <input
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Rue, repère, immeuble..."
                  className="w-full bg-white border-2 border-neutral-100 focus:border-[#FF4B11]/30 rounded-[20px] pl-11 pr-4 py-4 outline-none transition-all font-bold text-neutral-900 text-sm shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 block ml-1">Contact pour le livreur</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="77 123 45 67"
                  className="w-full bg-white border-2 border-neutral-100 focus:border-[#FF4B11]/30 rounded-[20px] pl-11 pr-4 py-4 outline-none transition-all font-bold text-neutral-900 text-sm shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment method */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-neutral-100 space-y-6">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-neutral-400" />
            <h3 className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em]">Moyen de paiement</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {PAYMENT_METHODS.map(m => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-[24px] border-2 transition-all relative overflow-hidden group ${
                  method === m.id
                    ? 'border-[#FF4B11] bg-[#FF4B11]/5'
                    : 'border-neutral-50 bg-white'
                }`}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-active:scale-90"
                  style={{ backgroundColor: m.color }}
                >
                  <m.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-black text-sm text-neutral-900">{m.name}</p>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">
                    {m.isCash ? 'En espèces' : `Compte ${m.name}`}
                  </p>
                </div>
                {method === m.id && (
                  <div className="bg-[#FF4B11] rounded-full p-1 shadow-md shadow-[#FF4B11]/30">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                )}
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
            <span className="font-extrabold text-lg text-[#FF4B11]">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <div className="flex-1" />
      <div className="sticky bottom-0 bg-white/90 backdrop-blur-xl border-t border-neutral-100 px-5 py-5 z-20">
        <button
          onClick={handlePay}
          disabled={processing || !phone || phone.length < 9}
          className="w-full bg-[#FF4B11] text-white font-black py-5 rounded-[24px] shadow-xl shadow-[#FF4B11]/30 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[13px]"
        >
          {processing ? (
            <>
              <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
              <span>Validation...</span>
            </>
          ) : (
            <>
              <span>Commander</span>
              <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
              <span>{formatPrice(total)}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentScreen;




