// ─── Owner's branches (multi-location restaurant concept) ───────────────────

export interface Branch {
  id: string;
  name: string;
  city: string;
  neighborhood: string;
  address: string;
  cuisine: string;
  image: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  deliveryFee: number;
  deliveryRadius: number; // km
  avgPrepTime: number; // minutes
  phone: string;
  rating: number;
  ordersToday: number;
  revenueToday: number;
  ordersMonth: number;
  revenueMonth: number;
  createdAt: string;
}

export const OWNER_BRANCHES: Branch[] = [
  {
    id: 'b1',
    name: 'SARI THIES CENTRE',
    city: 'Thiès',
    neighborhood: 'Thiès Centre',
    address: 'Rue des Baobabs, face au marché central',
    cuisine: 'Burgers & Plats Sénégalais',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
    isOpen: true,
    openTime: '09:00',
    closeTime: '23:00',
    deliveryFee: 500,
    deliveryRadius: 3,
    avgPrepTime: 20,
    phone: '+221 77 123 45 67',
    rating: 4.7,
    ordersToday: 24,
    revenueToday: 187500,
    ordersMonth: 642,
    revenueMonth: 5100000,
    createdAt: 'Janv. 2026',
  },
  {
    id: 'b2',
    name: 'SARI THIES NORD',
    city: 'Thiès',
    neighborhood: 'Thiès Nord',
    address: 'Avenue Lamine Guèye, Thiès Nord',
    cuisine: 'Burgers & Plats Sénégalais',
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600',
    isOpen: true,
    openTime: '10:00',
    closeTime: '22:30',
    deliveryFee: 600,
    deliveryRadius: 2.5,
    avgPrepTime: 25,
    phone: '+221 77 234 56 78',
    rating: 4.5,
    ordersToday: 14,
    revenueToday: 98000,
    ordersMonth: 387,
    revenueMonth: 2900000,
    createdAt: 'Févr. 2026',
  },
  {
    id: 'b3',
    name: 'SARI DAKAR PLATEAU',
    city: 'Dakar',
    neighborhood: 'Plateau',
    address: 'Boulevard de la République, Dakar',
    cuisine: 'Burgers & Fast Food',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600',
    isOpen: false,
    openTime: '11:00',
    closeTime: '23:59',
    deliveryFee: 700,
    deliveryRadius: 4,
    avgPrepTime: 30,
    phone: '+221 77 345 67 89',
    rating: 4.3,
    ordersToday: 0,
    revenueToday: 0,
    ordersMonth: 198,
    revenueMonth: 1680000,
    createdAt: 'Mars 2026',
  },
  {
    id: 'b4',
    name: 'SARI MBOUR SALY',
    city: 'Mbour',
    neighborhood: 'Saly',
    address: 'Zone hôtelière Saly, face à l\'hôtel Royam',
    cuisine: 'Burgers & Grillades',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600',
    isOpen: true,
    openTime: '12:00',
    closeTime: '01:00',
    deliveryFee: 500,
    deliveryRadius: 2,
    avgPrepTime: 18,
    phone: '+221 77 456 78 90',
    rating: 4.8,
    ordersToday: 31,
    revenueToday: 253000,
    ordersMonth: 810,
    revenueMonth: 6800000,
    createdAt: 'Avr. 2026',
  },
];

// ─── Orders per branch ───────────────────────────────────────────────────────

export interface BranchOrder {
  id: string;
  branchId: string;
  clientName: string;
  clientPhone: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'refused';
  deliveryMode: 'delivery' | 'pickup';
  address: string;
  createdAt: string;
  paymentMethod: string;
  livreurId?: string;
  logs?: { action: string; by: string; date: string }[];
}

export const BRANCH_ORDERS: BranchOrder[] = [
  { id: 'SARI901235', branchId: 'b1', clientName: 'Mamadou L.', clientPhone: '+221 77 888 99 00', items: [{ name: 'Burger Classique', qty: 2, price: 3500 }], total: 7500, status: 'pending', deliveryMode: 'delivery', address: 'Quartier Mbour 3', createdAt: 'À l\'instant', paymentMethod: 'cash' },
  { id: 'SARI901234', branchId: 'b1', clientName: 'Abdoulaye D.', clientPhone: '+221 77 541 23 87', items: [{ name: 'Burger Classique', qty: 2, price: 3500 }, { name: 'Frites Maison', qty: 1, price: 1500 }, { name: 'Bissap Frais', qty: 2, price: 1000 }], total: 11500, status: 'pending', deliveryMode: 'delivery', address: 'Rue des Baobabs, face à la pharmacie', createdAt: 'Il y a 2 min', paymentMethod: 'wave' },
  { id: 'SARI901198', branchId: 'b1', clientName: 'Fatou N.', clientPhone: '+221 76 312 98 00', items: [{ name: 'Poulet Yassa', qty: 1, price: 4000 }, { name: 'Thieboudienne', qty: 1, price: 4500 }], total: 9500, status: 'preparing', deliveryMode: 'delivery', address: 'Quartier Thiès Nord, Villa 14', createdAt: 'Il y a 12 min', paymentMethod: 'orange' },
  { id: 'SARI901101', branchId: 'b1', clientName: 'Moussa K.', clientPhone: '+221 78 456 00 12', items: [{ name: 'Burger Cheese Bacon', qty: 3, price: 4500 }, { name: 'Coca-Cola', qty: 3, price: 800 }], total: 16300, status: 'ready', deliveryMode: 'delivery', address: 'Avenue Mbour 1', createdAt: 'Il y a 18 min', paymentMethod: 'cash', livreurId: 'l1' },
  { id: 'SARI901055', branchId: 'b2', clientName: 'Rokhaya S.', clientPhone: '+221 76 678 90 12', items: [{ name: 'Burger Classique', qty: 1, price: 3500 }, { name: 'Bissap Frais', qty: 1, price: 1000 }], total: 5100, status: 'pending', deliveryMode: 'delivery', address: 'Cité Ballabey, Thiès Nord', createdAt: 'Il y a 5 min', paymentMethod: 'wave' },
  { id: 'SARI901020', branchId: 'b2', clientName: 'Omar T.', clientPhone: '+221 77 901 23 45', items: [{ name: 'Poulet Grillé', qty: 2, price: 5000 }], total: 10600, status: 'delivering', deliveryMode: 'delivery', address: 'Avenue Lamine Guèye, immeuble 7', createdAt: 'Il y a 25 min', paymentMethod: 'free', livreurId: 'l1' },
  { id: 'SARI900887', branchId: 'b4', clientName: 'Aminata B.', clientPhone: '+221 77 234 56 78', items: [{ name: 'Burger Cheese Bacon', qty: 2, price: 4500 }, { name: 'Salade de Fruits', qty: 2, price: 1800 }], total: 13200, status: 'preparing', deliveryMode: 'delivery', address: 'Hôtel Les Filaos, Saly', createdAt: 'Il y a 8 min', paymentMethod: 'wave' },
  { id: 'SARI900654', branchId: 'b1', clientName: 'Ibrahima S.', clientPhone: '+221 76 789 01 23', items: [{ name: 'Thiakry', qty: 2, price: 1500 }, { name: 'Bissap Frais', qty: 1, price: 1000 }], total: 4500, status: 'delivered', deliveryMode: 'delivery', address: 'Cité Ballabey, Thiès Centre', createdAt: 'Il y a 1h', paymentMethod: 'free' },
];

// ─── Menu items per branch ───────────────────────────────────────────────────

export interface BranchMenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  isAvailable: boolean;
  ordersCount: number;
  description: string;
}

export const BRANCH_MENU: BranchMenuItem[] = [
  { id: 'm1', name: 'Burger Classique', category: 'Burgers', price: 3500, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300', isAvailable: true, ordersCount: 234, description: 'Steak haché, salade, tomate, oignon, sauce maison' },
  { id: 'm2', name: 'Burger Cheese Bacon', category: 'Burgers', price: 4500, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300', isAvailable: true, ordersCount: 189, description: 'Double steak, cheddar, bacon croustillant' },
  { id: 'm3', name: 'Frites Maison', category: 'Burgers', price: 1500, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300', isAvailable: false, ordersCount: 421, description: 'Pommes de terre fraîches, sel de mer' },
  { id: 'm4', name: 'Poulet Yassa', category: 'Plats Sénégalais', price: 4000, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=300', isAvailable: true, ordersCount: 156, description: 'Poulet mariné aux oignons et citron, riz blanc' },
  { id: 'm5', name: 'Thieboudienne', category: 'Plats Sénégalais', price: 4500, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300', isAvailable: true, ordersCount: 312, description: 'Riz au poisson, légumes, sauce tomate' },
  { id: 'm6', name: 'Poulet Grillé', category: 'Poulet', price: 5000, image: 'https://images.unsplash.com/photo-1598103442257-8c4f763c5194?w=300', isAvailable: true, ordersCount: 98, description: 'Demi-poulet grillé, sauce piquante' },
  { id: 'm7', name: 'Bissap Frais', category: 'Boissons', price: 1000, image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300', isAvailable: true, ordersCount: 567, description: 'Jus d\'hibiscus maison, 50cl' },
  { id: 'm8', name: 'Coca-Cola', category: 'Boissons', price: 800, image: 'https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?w=300', isAvailable: true, ordersCount: 445, description: 'Canette 33cl' },
  { id: 'm9', name: 'Thiakry', category: 'Desserts', price: 1500, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300', isAvailable: true, ordersCount: 78, description: 'Dessert au mil et yaourt' },
  { id: 'm10', name: 'Salade de Fruits', category: 'Desserts', price: 1800, image: 'https://images.unsplash.com/photo-1564093497595-593b96d80180?w=300', isAvailable: false, ordersCount: 45, description: 'Mangue, ananas, papaye frais' },
];

export const MENU_CATS = ['Tous', 'Burgers', 'Plats Sénégalais', 'Poulet', 'Boissons', 'Desserts'];

export const MANAGER_STATS = {
  todayOrders: 24,
  todayRevenue: 187500,
  rating: 4.7,
  weekOrders: 156,
  weekRevenue: 1250000,
};

// ─── Managers (Gérants) ──────────────────────────────────────────────────────

export interface Gerant {
  id: string;
  branchId: string;
  name: string;
  phone: string;
  isActive: boolean;
}

export const BRANCH_GERANTS: Gerant[] = [
  { id: 'g1', branchId: 'b1', name: 'Babacar Ndiaye', phone: '+221 77 000 11 22', isActive: true },
  { id: 'g2', branchId: 'b2', name: 'Aissatou Sow', phone: '+221 76 111 22 33', isActive: true }
];

// ─── Delivery Drivers (Livreurs) ─────────────────────────────────────────────

export interface Livreur {
  id: string;
  branchId: string;
  name: string;
  phone: string;
  isActive: boolean;
  ordersDelivered: number;
}

export const BRANCH_LIVREURS: Livreur[] = [
  { id: 'l1', branchId: 'b1', name: 'Moussa Diop', phone: '+221 77 111 22 33', isActive: true, ordersDelivered: 45 },
  { id: 'l2', branchId: 'b1', name: 'Ousmane Fall', phone: '+221 76 222 33 44', isActive: false, ordersDelivered: 12 },
  { id: 'l3', branchId: 'b2', name: 'Cheikh Ndiaye', phone: '+221 78 333 44 55', isActive: true, ordersDelivered: 89 },
];
