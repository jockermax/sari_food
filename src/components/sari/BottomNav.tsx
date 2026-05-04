import { useAppContext, Screen } from '@/contexts/AppContext';
import { Home, ShoppingBag, ClipboardList, User } from 'lucide-react';

const BottomNav: React.FC = () => {
  const { screen, setScreen, cart } = useAppContext();
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const items: { id: Screen; label: string; badge?: number; icon: any }[] = [
    { id: 'restaurants', label: 'Accueil', icon: Home },
    { id: 'cart', label: 'Panier', badge: cartCount, icon: ShoppingBag },
    { id: 'orders', label: 'Commandes', icon: ClipboardList },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  const isActive = (id: Screen) => {
    if (id === 'restaurants') return screen === 'restaurants' || screen === 'restaurant-detail';
    if (id === 'orders') return screen === 'tracking' || screen === 'orders';
    return screen === id;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-neutral-100 z-40 safe-bottom max-w-md mx-auto pb-2">
      <div className="max-w-md mx-auto grid grid-cols-4 h-16">
        {items.map(item => {
          const active = isActive(item.id);
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className="flex flex-col items-center justify-center relative transition-all active:scale-90"
            >
              <div className="relative mb-1">
                <Icon className={`w-5.5 h-5.5 transition-colors duration-300 ${
                  active ? 'text-[#FF4B11]' : 'text-neutral-400'
                }`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#FF4B11] text-white text-[9px] font-black rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1 border-2 border-white shadow-sm animate-in zoom-in duration-300">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest transition-colors duration-300 ${
                active ? 'text-[#FF4B11]' : 'text-neutral-400'
              }`}>
                {item.label}
              </span>
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#FF4B11] rounded-b-full shadow-sm shadow-[#FF4B11]/20" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;





