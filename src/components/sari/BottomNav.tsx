import React from 'react';
import { Home, ShoppingBag, Clock, User } from 'lucide-react';
import { useAppContext, Screen } from '@/contexts/AppContext';

const BottomNav: React.FC = () => {
  const { screen, setScreen, cart } = useAppContext();
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const items: { id: Screen; label: string; Icon: any; badge?: number }[] = [
    { id: 'restaurants', label: 'Accueil', Icon: Home },
    { id: 'cart', label: 'Panier', Icon: ShoppingBag, badge: cartCount },
    { id: 'orders', label: 'Commandes', Icon: Clock },
    { id: 'profile', label: 'Profil', Icon: User },
  ];

  const isActive = (id: Screen) => {
    if (id === 'restaurants') return screen === 'restaurants' || screen === 'restaurant-detail';
    if (id === 'orders') return screen === 'tracking' || screen === 'orders';
    return screen === id;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 z-40 safe-bottom max-w-md mx-auto">
      <div className="max-w-md mx-auto grid grid-cols-4">
        {items.map(item => {
          const active = isActive(item.id);
          const Icon = item.Icon;
          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className="flex flex-col items-center py-3 relative transition-colors"
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${active ? 'text-[#C94A2A]' : 'text-neutral-400'}`} 
                  strokeWidth={active ? 2.5 : 2} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#C94A2A] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-1 font-medium ${active ? 'text-[#C94A2A]' : 'text-neutral-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
