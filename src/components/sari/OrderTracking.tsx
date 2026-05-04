import React, { useState, useEffect } from 'react';

import Map, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAppContext } from '@/contexts/AppContext';
import { formatPrice } from '@/data/sariData';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Phone, 
  MessageCircle, 
  Star, 
  ChevronRight,
  Package,
  Bike,
  CheckCircle2,
  ReceiptText
} from 'lucide-react';

const STATUSES = [
  { id: 'received', label: 'Commande reçue', desc: 'Votre commande a été reçue' },
  { id: 'preparing', label: 'En préparation', desc: 'Le restaurant prépare votre commande' },
  { id: 'delivering', label: 'En livraison', desc: 'Votre livreur est en route' },
  { id: 'delivered', label: 'Livrée', desc: 'Bon appétit !' },
];

const OrderTracking: React.FC = () => {
  const { currentOrder, setScreen } = useAppContext();
  const [statusIdx, setStatusIdx] = useState(0);
  
  // Simulation du mouvement du livreur
  const restaurantPos = { lng: -16.973, lat: 14.425 };
  const customerPos = { lng: -16.969, lat: 14.422 };
  const [driverPos, setDriverPos] = useState(restaurantPos);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStatusIdx(1), 2000),
      setTimeout(() => setStatusIdx(2), 5000),
      setTimeout(() => setStatusIdx(3), 15000), // Augmenté pour voir le mouvement
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Animation du livreur quand il est en route
  useEffect(() => {
    if (statusIdx === 2) {
      const startTime = Date.now();
      const duration = 10000; // 10 secondes pour le trajet simu
      
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        setDriverPos({
          lng: restaurantPos.lng + (customerPos.lng - restaurantPos.lng) * progress,
          lat: restaurantPos.lat + (customerPos.lat - restaurantPos.lat) * progress,
        });

        if (progress === 1) clearInterval(interval);
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [statusIdx]);

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-[#FDF6EC] flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-neutral-500 mb-4">Aucune commande en cours</p>
          <button
            onClick={() => setScreen('restaurants')}
            className="bg-[#FF4B11] text-white font-bold px-6 py-3 rounded-xl"
          >
            Commander
          </button>
        </div>
      </div>
    );
  }

  const eta = Math.max(1, 30 - statusIdx * 8);

  return (
    <div className="min-h-screen bg-[#FDF6EC] pb-6">
      <div className="bg-white sticky top-0 z-20 border-b border-neutral-100 shadow-sm px-5 py-4 flex items-center gap-3">
        <button
          onClick={() => setScreen('restaurants')}
          className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center active:scale-90 transition-all hover:bg-neutral-200"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-900" />
        </button>
        <div>
          <h1 className="text-xl font-black text-neutral-900 leading-none">Suivi de commande</h1>
          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-1.5">ID: {currentOrder.id}</p>
        </div>
      </div>

      {/* Map */}
      <div className="relative h-56 bg-neutral-200">
        <Map
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
          initialViewState={{
            longitude: (restaurantPos.lng + customerPos.lng) / 2,
            latitude: (restaurantPos.lat + customerPos.lat) / 2,
            zoom: 14.5
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
        >
          {/* Restaurant */}
          <Marker longitude={restaurantPos.lng} latitude={restaurantPos.lat} anchor="bottom">
            <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center shadow-lg border-2 border-white">
              <span className="text-white text-xs">🍔</span>
            </div>
          </Marker>

          {/* Destination (Customer) */}
          <Marker longitude={customerPos.lng} latitude={customerPos.lat} anchor="bottom">
            <div className="w-10 h-10 rounded-full bg-[#87C025] flex items-center justify-center shadow-xl border-2 border-white">
              <span className="text-white text-lg">📍</span>
            </div>
          </Marker>

          {/* Livreur (en mouvement fluide) */}
          {statusIdx >= 2 && (
            <Marker longitude={driverPos.lng} latitude={driverPos.lat} anchor="center">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-[#FF4B11] flex items-center justify-center shadow-2xl border-2 border-white">
                  <span className="text-white text-xl">🛵</span>
                </div>
                <div className="absolute inset-0 rounded-full bg-[#FF4B11]/40 animate-ping" />
              </div>
            </Marker>
          )}
        </Map>
      </div>

      <div className="px-5 -mt-6 relative z-10">
        <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-neutral-200/50 border border-neutral-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-black text-xl text-neutral-900 leading-tight">
                {STATUSES[statusIdx].label}
              </h2>
              <p className="text-xs font-bold text-neutral-400 mt-1 uppercase tracking-wider">{STATUSES[statusIdx].desc}</p>
            </div>
            <div className="bg-[#FF4B11]/5 text-[#FF4B11] px-4 py-2 rounded-[18px] border border-[#FF4B11]/10 flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-tighter">Arrivée</span>
              <span className="font-black text-lg leading-none mt-0.5">{eta} min</span>
            </div>
          </div>

          <div className="space-y-6">
            {STATUSES.map((s, i) => {
              const done = i < statusIdx;
              const active = i === statusIdx;
              const icons = [Clock, Package, Bike, CheckCircle2];
              const Icon = icons[i];
              
              return (
                <div key={s.id} className="flex gap-4 relative group">
                  {i < STATUSES.length - 1 && (
                    <div className={`absolute left-[19px] top-10 w-[2px] h-8 rounded-full ${done ? 'bg-[#87C025]' : 'bg-neutral-100'}`} />
                  )}
                  <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                    done ? 'bg-[#87C025] text-white' :
                    active ? 'bg-[#FF4B11] text-white shadow-lg shadow-[#FF4B11]/25 scale-110' : 'bg-neutral-50 text-neutral-300'
                  }`}>
                    <Icon className={`w-5 h-5 ${active ? 'animate-pulse' : ''}`} />
                  </div>
                  <div className="flex-1 pt-1.5">
                    <p className={`font-black text-xs uppercase tracking-widest ${active ? 'text-neutral-900' : done ? 'text-[#87C025]' : 'text-neutral-300'}`}>
                      {s.label}
                    </p>
                    {active && <p className="text-[10px] font-bold text-neutral-400 mt-1">{s.desc}</p>}
                  </div>
                  {done && (
                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center border border-neutral-100 shadow-sm mt-2">
                      <CheckCircle2 className="w-3 h-3 text-[#87C025]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery person */}
        {statusIdx >= 2 && statusIdx < 3 && (
          <div className="bg-white rounded-[28px] p-5 shadow-sm mt-5 border border-neutral-100 flex items-center gap-4 animate-fade-in group">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200"
                alt="Livreur"
                className="w-16 h-16 rounded-[22px] object-cover shadow-sm group-hover:scale-105 transition-transform"
              />
              <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-[#87C025] rounded-xl shadow-md border-[3px] border-white flex items-center justify-center">
                <Bike className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-black text-neutral-900 text-base leading-none mb-1.5">Moussa D.</p>
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-[11px] font-black text-neutral-500 uppercase tracking-widest leading-none">4.9 · Livreur Pro</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-11 h-11 rounded-[16px] bg-neutral-50 flex items-center justify-center text-neutral-400 hover:bg-neutral-100 active:scale-90 transition-all border border-neutral-100/50">
                <MessageCircle className="w-5 h-5" />
              </button>
              <button className="w-11 h-11 rounded-[16px] bg-[#FF4B11] flex items-center justify-center text-white shadow-lg shadow-[#FF4B11]/25 active:scale-90 transition-all hover:bg-[#e6440f]">
                <Phone className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Order summary */}
        <div className="bg-white rounded-[28px] p-6 shadow-sm mt-4 border border-neutral-100">
          <div className="flex items-center gap-2 mb-4">
            <ReceiptText className="w-4 h-4 text-neutral-400" />
            <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Détails de la commande</h4>
          </div>
          <div className="space-y-3 mb-5">
            {currentOrder.items.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-neutral-50 flex items-center justify-center text-[10px] font-black text-neutral-400 border border-neutral-100">
                    {item.quantity}
                  </div>
                  <span className="font-bold text-neutral-700">{item.name}</span>
                </div>
                <span className="font-black text-neutral-900">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-neutral-50 pt-4 flex justify-between items-center">
            <span className="font-black text-[10px] text-neutral-400 uppercase tracking-widest">Total payé</span>
            <span className="font-black text-xl text-[#FF4B11]">{formatPrice(currentOrder.total)}</span>
          </div>
        </div>

        {statusIdx === 3 && (
          <div className="space-y-4 mt-8">
            <button
              onClick={() => setScreen('rating')}
              className="w-full bg-neutral-900 text-white font-black py-5 rounded-[24px] shadow-xl shadow-neutral-900/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all uppercase tracking-widest text-[13px]"
            >
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" /> 
              Évaluer ma commande
            </button>
            <button
              onClick={() => setScreen('restaurants')}
              className="w-full bg-[#FF4B11] text-white font-black py-5 rounded-[24px] shadow-xl shadow-[#FF4B11]/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all uppercase tracking-widest text-[13px]"
            >
              Commander à nouveau
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(8px);} to { opacity: 1; transform: translateY(0);} }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default OrderTracking;





