import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { useAppContext } from '@/contexts/AppContext';
import SplashScreen from './sari/SplashScreen';
import Onboarding from './sari/Onboarding';
import AuthScreen from './sari/AuthScreen';
import RoleSelector from './sari/RoleSelector';
import LocationScreen from './sari/LocationScreen';
import RestaurantList from './sari/RestaurantList';
import RestaurantDetail from './sari/RestaurantDetail';
import CartScreen from './sari/CartScreen';
import PaymentScreen from './sari/PaymentScreen';
import OrderTracking from './sari/OrderTracking';
import ProfileScreen from './sari/ProfileScreen';
import OrdersScreen from './sari/OrdersScreen';
import FavoritesScreen from './sari/FavoritesScreen';
import RatingScreen from './sari/RatingScreen';
import OwnerDashboard from './sari/OwnerDashboard';
import OwnerBranch from './sari/OwnerBranch';
import OwnerMenu from './sari/OwnerMenu';
import OwnerCreateBranch from './sari/OwnerCreateBranch';
import GerantDashboard from './sari/GerantDashboard';
import GerantMenu from './sari/GerantMenu';
import GerantOrderDetail from './sari/GerantOrderDetail';
import GerantLivreurs from './sari/GerantLivreurs';
import GerantSettings from './sari/GerantSettings';
import LivreurDashboard from './sari/LivreurDashboard';
import OwnerGerants from './sari/OwnerGerants';
import BottomNav from './sari/BottomNav';
import AddressBook from './sari/AddressBook';
import GerantInventory from './sari/GerantInventory';

const AppLayout: React.FC = () => {
  const { screen } = useAppContext();

  const renderScreen = () => {
    switch (screen) {
      case 'splash':               return <SplashScreen />;
      case 'onboarding':           return <Onboarding />;
      case 'auth':                 return <AuthScreen />;
      case 'role-select':          return <RoleSelector />;
      case 'location':             return <LocationScreen />;
      case 'restaurants':          return <RestaurantList />;
      case 'restaurant-detail':    return <RestaurantDetail />;
      case 'cart':                 return <CartScreen />;
      case 'payment':              return <PaymentScreen />;
      case 'tracking':             return <OrderTracking />;
      case 'profile':              return <ProfileScreen />;
      case 'orders':               return <OrdersScreen />;
      case 'favorites':            return <FavoritesScreen />;
      case 'rating':               return <RatingScreen />;
      case 'owner-dashboard':      return <OwnerDashboard />;
      case 'owner-branch':         return <OwnerBranch />;
      case 'owner-menu':           return <OwnerMenu />;
      case 'owner-create-branch':  return <OwnerCreateBranch />;
      case 'owner-gerants':        return <OwnerGerants />;
      case 'gerant-dashboard':     return <GerantDashboard />;
      case 'gerant-menu':          return <GerantMenu />;
      case 'gerant-order-detail':  return <GerantOrderDetail />;
      case 'gerant-livreurs':      return <GerantLivreurs />;
      case 'gerant-settings':      return <GerantSettings />;
      case 'gerant-inventory':     return <GerantInventory />;
      case 'livreur-dashboard':    return <LivreurDashboard />;
      case 'address-book':         return <AddressBook />;
      default:                     return <SplashScreen />;
    }
  };

  const CLIENT_SCREENS: string[] = [
    'restaurants', 'profile', 'orders', 'favorites'
  ];
  const showBottomNav = CLIENT_SCREENS.includes(screen);

  return (
    <div className="font-sans antialiased bg-white text-neutral-900 max-w-md mx-auto min-h-screen shadow-2xl relative overflow-x-hidden">
      <Toaster position="top-center" expand={false} richColors closeButton />
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="min-h-screen"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
      {showBottomNav && <BottomNav />}
    </div>
  );
};

export default AppLayout;
