import React, { useState, useEffect } from 'react';
import { Check, Phone, MessageCircle, ArrowLeft } from 'lucide-react';
import Map, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAppContext } from '@/contexts/AppContext';
import { formatPrice } from '@/data/sariData';

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
            className="bg-[#C94A2A] text-white font-bold px-6 py-3 rounded-xl"
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
      <div className="bg-white sticky top-0 z-10 px-5 py-4 flex items-center gap-3 shadow-sm">
        <button
          onClick={() => setScreen('restaurants')}
          className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-base font-bold">Suivi de commande</h1>
          <p className="text-xs text-neutral-500">#{currentOrder.id}</p>
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
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-xl border-2 border-white">
              <span className="text-white text-lg">📍</span>
            </div>
          </Marker>

          {/* Livreur (en mouvement fluide) */}
          {statusIdx >= 2 && (
            <Marker longitude={driverPos.lng} latitude={driverPos.lat} anchor="center">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-[#C94A2A] flex items-center justify-center shadow-2xl border-2 border-white">
                  <span className="text-white text-xl">🛵</span>
                </div>
                <div className="absolute inset-0 rounded-full bg-[#C94A2A]/40 animate-ping" />
              </div>
            </Marker>
          )}
        </Map>
      </div>

      <div className="px-5 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-extrabold text-lg text-neutral-900">
              {STATUSES[statusIdx].label}
            </h2>
            <span className="bg-[#FDF6EC] text-[#C94A2A] font-bold text-sm px-3 py-1 rounded-full">
              ~{eta} min
            </span>
          </div>
          <p className="text-sm text-neutral-500">{STATUSES[statusIdx].desc}</p>

          <div className="mt-5 space-y-4">
            {STATUSES.map((s, i) => {
              const done = i < statusIdx;
              const active = i === statusIdx;
              return (
                <div key={s.id} className="flex gap-3 relative">
                  {i < STATUSES.length - 1 && (
                    <div className={`absolute left-[15px] top-9 w-0.5 h-6 ${done ? 'bg-green-500' : 'bg-neutral-200'}`} />
                  )}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    done ? 'bg-green-500' :
                    active ? 'bg-[#C94A2A] shadow-lg shadow-[#C94A2A]/30' : 'bg-neutral-200'
                  }`}>
                    {done ? <Check className="w-4 h-4 text-white" /> : (
                      <span className={`w-2 h-2 rounded-full ${active ? 'bg-white animate-pulse' : 'bg-neutral-400'}`} />
                    )}
                  </div>
                  <div className="flex-1 pb-1">
                    <p className={`font-bold text-sm ${active ? 'text-[#C94A2A]' : done ? 'text-green-600' : 'text-neutral-400'}`}>
                      {s.label}
                    </p>
                    {active && <p className="text-xs text-neutral-500 mt-0.5">{s.desc}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery person */}
        {statusIdx >= 2 && statusIdx < 3 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm mt-4 flex items-center gap-3 animate-fade-in">
            <img
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200"
              alt="Livreur"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="font-bold text-sm">Moussa D.</p>
              <p className="text-xs text-neutral-500">Votre livreur · ⭐ 4.9</p>
            </div>
            <button className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 rounded-full bg-[#C94A2A] flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </button>
          </div>
        )}

        {/* Order summary */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-sm">Détails de la commande</h4>
            <span className="text-xs text-neutral-500">{currentOrder.restaurant?.name}</span>
          </div>
          <div className="space-y-2 mb-3">
            {currentOrder.items.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-neutral-700">{item.quantity}× {item.name}</span>
                <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-neutral-100 pt-3 flex justify-between">
            <span className="font-bold">Total payé</span>
            <span className="font-extrabold text-[#C94A2A]">{formatPrice(currentOrder.total)}</span>
          </div>
        </div>

        {statusIdx === 3 && (
          <div className="space-y-3 mt-4">
            <button
              onClick={() => setScreen('rating')}
              className="w-full bg-[#F4A012] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#F4A012]/30 flex items-center justify-center gap-2"
            >
              ⭐ Évaluer la commande
            </button>
            <button
              onClick={() => setScreen('restaurants')}
              className="w-full bg-[#C94A2A] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#C94A2A]/30"
            >
              Commander à nouveau
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
