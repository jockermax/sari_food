import React, { useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';

// Onboarding supprimé — redirige immédiatement vers la sélection de rôle
const Onboarding: React.FC = () => {
  const { setScreen } = useAppContext();
  useEffect(() => { setScreen('role-select'); }, []);
  return null;
};

export default Onboarding;
