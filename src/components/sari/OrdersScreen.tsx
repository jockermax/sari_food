import React from 'react';
import { Clock, Check, ChevronRight, RotateCcw, ShoppingBag } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { formatPrice } from '@/data/sariData';

const pastOrders = [
  {
    id: 'SARI887123', restaurantId: 'r1', restaurant: 'Teranga Food',
    date: 'Hier, 19:30', items: ['2× Burger Classique', '1× Bissap Frais'], total: 8500,
  },
  {
    id: 'SARI886544', restaurantId: 'r2', restaurant: 'Chez Aminata',
    date: '22 Avr, 13:15', items: ['1× Poulet Yassa', '1× Thiéboudienne'], total: 5500,
  },
  {
    id: 'SARI885201', restaurantId: 'r3', restaurant: 'Le Baobab',
    date: '20 Avr, 20:00', items: ['2× Thiakry', '1× Salade de Fruits', '1× Coca-Cola'], total: 12000,
  },
  {
    id: 'SARI884099', restaurantId: 'r1', restaurant: 'Teranga Food',
    date: '18 Avr, 12:45', items: ['1× Burger Cheese Bacon'], total: 4500,
  },
];

const OrdersScreen: React.FC = () => {
  const { currentOrder, setScreen, setSelectedRestaurantId } = useAppContext();

  const handleReorder = (restaurantId: string) => {
    setSelectedRestaurantId(restaurantId);
    setScreen('restaurant-detail');
  };

  return (
    <div className="min-h-screen bg-[#FDF6EC] pb-24">
      <div className="bg-white px-5 pt-6 pb-4 border-b border-neutral-100">
        <h1 className="text-2xl font-extrabold text-neutral-900">Mes commandes</h1>
        <p className="text-sm text-neutral-500 mt-1">Historique et commandes en cours</p>
      </div>

      <div className="px-5 pt-5 space-y-6">
        {currentOrder && (
          <div>
            <h3 className="text-xs font-extrabold text-neutral-500 uppercase tracking-wider mb-3">En cours</h3>
            <button
              onClick={() => setScreen('tracking')}
              className="w-full bg-white rounded-2xl p-4 shadow-sm border-2 border-[#C94A2A] active:scale-[0.99] text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C94A2A] animate-pulse" />
                  <span className="text-xs font-bold text-[#C94A2A] uppercase">Livraison en cours</span>
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-400" />
              </div>
              <p className="font-bold text-neutral-900">{currentOrder.restaurant?.name}</p>
              <p className="text-xs text-neutral-500 mt-0.5">#{currentOrder.id} · {currentOrder.items?.length || 0} article(s)</p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1 text-xs text-neutral-600">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-semibold">Livraison ~25 min</span>
                </div>
                <span className="font-extrabold text-[#C94A2A]">{formatPrice(currentOrder.total)}</span>
              </div>
            </button>
          </div>
        )}

        <div>
          <h3 className="text-xs font-extrabold text-neutral-500 uppercase tracking-wider mb-3">
            Historique ({pastOrders.length})
          </h3>
          <div className="space-y-3">
            {pastOrders.map(o => (
              <div key={o.id} className="bg-white rounded-2xl p-4 shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-xs font-bold text-green-600 uppercase">Livrée</span>
                  </div>
                  <span className="text-xs text-neutral-400">{o.date}</span>
                </div>

                {/* Restaurant info */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FDF6EC] flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-5 h-5 text-[#C94A2A]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-neutral-900">{o.restaurant}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">#{o.id}</p>
                    <p className="text-xs text-neutral-600 mt-1 truncate">{o.items.join(' · ')}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                  <span className="font-extrabold text-neutral-900">{formatPrice(o.total)}</span>
                  <button
                    onClick={() => handleReorder(o.restaurantId)}
                    className="flex items-center gap-1.5 bg-[#C94A2A] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-[#C94A2A]/25 active:scale-95 transition-transform"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Re-commander
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersScreen;
