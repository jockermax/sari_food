import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export type Screen = 
  | 'splash' | 'onboarding' | 'auth' | 'role-select'
  | 'location' | 'restaurants' | 'restaurant-detail'
  | 'cart' | 'payment' | 'tracking' | 'profile' | 'orders' | 'favorites' | 'rating' | 'address-book'
  | 'owner-dashboard' | 'owner-branch' | 'owner-menu' | 'owner-order' | 'owner-create-branch' | 'owner-gerants'
  | 'gerant-dashboard' | 'gerant-menu' | 'gerant-order-detail' | 'gerant-livreurs' | 'gerant-settings' | 'gerant-inventory'
  | 'livreur-dashboard';

export type Role = 'client' | 'owner' | 'gerant' | 'livreur';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  restaurantId: string;
}

export interface Location {
  city: string;
  neighborhood: string;
}

const FAVORITES_KEY = 'sari_favorites';

const loadFavorites = (): string[] => {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

interface AppContextType {
  screen: Screen;
  setScreen: (s: Screen) => void;
  role: Role;
  setRole: (r: Role) => void;
  location: Location | null;
  setLocation: (l: Location | null) => void;
  selectedRestaurantId: string | null;
  setSelectedRestaurantId: (id: string | null) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  activeBranchId: string | null;
  setActiveBranchId: (id: string | null) => void;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  phone: string;
  setPhone: (p: string) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (v: boolean) => void;
  currentOrder: any;
  setCurrentOrder: (o: any) => void;
  favorites: string[];
  toggleFavorite: (restaurantId: string) => void;
  isFavorite: (restaurantId: string) => boolean;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);
export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const routerLocation = useLocation();

  const [screen, setScreenState] = useState<Screen>('splash');
  const [role, setRole] = useState<Role>('client');
  const [location, setLocation] = useState<Location | null>(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [activeBranchId, setActiveBranchId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [phone, setPhone] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [favorites, setFavorites] = useState<string[]>(loadFavorites);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const path = routerLocation.pathname.substring(1);
    if (path && path !== screen) {
      setScreenState(path as Screen);
    } else if (routerLocation.pathname === '/') {
      setScreenState('splash');
      navigate('/splash');
    }
  }, [routerLocation.pathname]);

  const setScreen = (s: Screen) => {
    setScreenState(s);
    navigate(`/${s}`);
  };

  useEffect(() => {
    const t = setTimeout(() => {
      if (screen === 'splash') setScreen('onboarding');
    }, 2000);
    return () => clearTimeout(t);
  }, [screen]);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };
  const clearCart = () => setCart([]);

  const toggleFavorite = (restaurantId: string) => {
    setFavorites(prev =>
      prev.includes(restaurantId)
        ? prev.filter(id => id !== restaurantId)
        : [...prev, restaurantId]
    );
  };
  const isFavorite = (restaurantId: string) => favorites.includes(restaurantId);

  return (
    <AppContext.Provider value={{
      screen, setScreen, role, setRole,
      location, setLocation,
      selectedRestaurantId, setSelectedRestaurantId,
      selectedOrderId, setSelectedOrderId,
      activeBranchId, setActiveBranchId,
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      phone, setPhone, isAuthenticated, setIsAuthenticated,
      currentOrder, setCurrentOrder,
      favorites, toggleFavorite, isFavorite,
      sidebarOpen, toggleSidebar: () => setSidebarOpen(p => !p),
    }}>
      {children}
    </AppContext.Provider>
  );
};
