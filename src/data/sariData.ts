export const LOGO_URL = "/sari_logo.png";

export interface City {
  name: string;
  neighborhoods: string[];
}

export const CITIES: City[] = [
  { name: "Thiès", neighborhoods: ["Thiès Centre", "Thiès Nord", "Thiès Sud"] },
  { name: "Dakar", neighborhoods: ["Plateau", "Médina", "Parcelles Assainies", "Yoff"] },
  { name: "Mbour", neighborhoods: ["Mbour Centre", "Saly", "Mbour Nord"] },
  { name: "Kaolack", neighborhoods: ["Kaolack Centre", "Médina Baye"] },
  { name: "Saint-Louis", neighborhoods: ["Sor", "Île Nord", "Île Sud"] },
];

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  reviews: number;
  deliveryTime: string;
  deliveryFee: number;
  distance: string;
  isOpen: boolean;
  neighborhood: string;
  city: string;
  tags: string[];
}

export const RESTAURANTS: Restaurant[] = [
  {
    id: "r1", name: "SARI THIES CENTRE", cuisine: "Burgers & Frites",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
    rating: 4.7, reviews: 234, deliveryTime: "25-30", deliveryFee: 500,
    distance: "1.2 km", isOpen: true, neighborhood: "Thiès Centre", city: "Thiès",
    tags: ["Populaire", "Rapide"],
  },
  {
    id: "r2", name: "SARI THIES NORD", cuisine: "Poulet & Grillades",
    image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=800&auto=format&fit=crop&q=80",
    rating: 4.5, reviews: 189, deliveryTime: "30-35", deliveryFee: 700,
    distance: "2.4 km", isOpen: true, neighborhood: "Thiès Centre", city: "Thiès",
    tags: ["Halal"],
  },
  {
    id: "r3", name: "SARI DAKAR PLATEAU", cuisine: "Cuisine Sénégalaise",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80",
    rating: 4.8, reviews: 412, deliveryTime: "20-25", deliveryFee: 500,
    distance: "0.8 km", isOpen: true, neighborhood: "Plateau", city: "Dakar",
    tags: ["Populaire", "Thieboudienne"],
  },
  {
    id: "r4", name: "SARI DAKAR FASS", cuisine: "Shawarma & Tacos",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80",
    rating: 4.3, reviews: 156, deliveryTime: "15-20", deliveryFee: 500,
    distance: "1.5 km", isOpen: true, neighborhood: "Plateau", city: "Dakar",
    tags: ["Rapide"],
  },
  {
    id: "r5", name: "SARI MEDINA", cuisine: "Grillades Sénégalaises",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
    rating: 4.6, reviews: 298, deliveryTime: "35-40", deliveryFee: 800,
    distance: "3.1 km", isOpen: true, neighborhood: "Médina", city: "Dakar",
    tags: ["Halal", "Traditionnel"],
  },
  {
    id: "r6", name: "SARI YOFF", cuisine: "Poulet Yassa",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&auto=format&fit=crop&q=80",
    rating: 4.4, reviews: 167, deliveryTime: "25-30", deliveryFee: 600,
    distance: "1.9 km", isOpen: false, neighborhood: "Yoff", city: "Dakar",
    tags: ["Halal"],
  },
  {
    id: "r7", name: "SARI MBOUR SALY", cuisine: "Burgers Gourmet",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&auto=format&fit=crop&q=80",
    rating: 4.5, reviews: 203, deliveryTime: "20-25", deliveryFee: 500,
    distance: "0.6 km", isOpen: true, neighborhood: "Saly", city: "Mbour",
    tags: ["Nouveau"],
  },
  {
    id: "r8", name: "SARI MBOUR CENTRE", cuisine: "Pizza & Pasta",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
    rating: 4.6, reviews: 345, deliveryTime: "30-35", deliveryFee: 700,
    distance: "2.0 km", isOpen: true, neighborhood: "Mbour Centre", city: "Mbour",
    tags: ["Populaire"],
  },
  {
    id: "r9", name: "SARI PARCELLES", cuisine: "Sandwich & Jus",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80",
    rating: 4.2, reviews: 98, deliveryTime: "15-20", deliveryFee: 400,
    distance: "0.4 km", isOpen: true, neighborhood: "Parcelles Assainies", city: "Dakar",
    tags: ["Rapide"],
  },
  {
    id: "r10", name: "SARI KAOLACK", cuisine: "Fast Food Africain",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80",
    rating: 4.3, reviews: 124, deliveryTime: "25-30", deliveryFee: 600,
    distance: "1.7 km", isOpen: true, neighborhood: "Kaolack Centre", city: "Kaolack",
    tags: ["Halal"],
  },
  {
    id: "r11", name: "SARI SAINT-LOUIS", cuisine: "Poissons & Riz",
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&auto=format&fit=crop&q=80",
    rating: 4.7, reviews: 256, deliveryTime: "30-35", deliveryFee: 700,
    distance: "2.3 km", isOpen: true, neighborhood: "Sor", city: "Saint-Louis",
    tags: ["Populaire", "Traditionnel"],
  },
  {
    id: "r12", name: "SARI ONCAD", cuisine: "Shawarma & Burgers",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&auto=format&fit=crop&q=80",
    rating: 4.4, reviews: 178, deliveryTime: "20-25", deliveryFee: 500,
    distance: "1.0 km", isOpen: true, neighborhood: "Thiès Nord", city: "Thiès",
    tags: ["Rapide", "Halal"],
  },
];

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
}

export const MENU_CATEGORIES = ["Populaires", "Burgers", "Pizzas", "Tacos", "Poulet", "Plats Sénégalais", "Boissons", "Desserts"];

export const MENU_ITEMS: MenuItem[] = [
  { id: "m1",  restaurantId: "r1", name: "Burger Classique",      description: "Steak haché, salade, tomate, oignon, sauce maison",         price: 3500, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",  category: "Burgers",          popular: true },
  { id: "m2",  restaurantId: "r1", name: "Burger Cheese Bacon",   description: "Double steak, cheddar, bacon croustillant",                  price: 4500, image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&auto=format&fit=crop&q=80",  category: "Burgers",          popular: true },
  { id: "m3",  restaurantId: "r1", name: "Frites Maison",          description: "Pommes de terre fraîches, sel de mer",                       price: 1500, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80",  category: "Burgers" },
  { id: "m11", restaurantId: "r1", name: "Pizza Margherita",        description: "Sauce tomate, mozzarella, basilic frais",                    price: 5500, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80",  category: "Pizzas",           popular: true },
  { id: "m12", restaurantId: "r1", name: "Pizza 4 Fromages",        description: "Mozzarella, cheddar, emmental, parmesan",                   price: 6000, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",  category: "Pizzas" },
  { id: "m13", restaurantId: "r1", name: "Pizza Poulet BBQ",        description: "Poulet grillé, sauce barbecue, oignons caramélisés",         price: 6500, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80",  category: "Pizzas" },
  { id: "m14", restaurantId: "r1", name: "Tacos Bœuf",              description: "Bœuf épicé, fromage fondu, salade, crème fraîche",           price: 3000, image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&auto=format&fit=crop&q=80",  category: "Tacos",            popular: true },
  { id: "m15", restaurantId: "r1", name: "Tacos Poulet Fromage",    description: "Poulet mariné, double fromage, sauce blanche et piquante",  price: 3500, image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&auto=format&fit=crop&q=80",  category: "Tacos" },
  { id: "m16", restaurantId: "r1", name: "Tacos Mixte",             description: "Bœuf + poulet, légumes grillés, double fromage",             price: 4000, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80",  category: "Tacos" },
  { id: "m4",  restaurantId: "r1", name: "Poulet Yassa",            description: "Poulet mariné aux oignons et citron, riz blanc",            price: 4000, image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&auto=format&fit=crop&q=80",  category: "Plats Sénégalais", popular: true },
  { id: "m5",  restaurantId: "r1", name: "Thieboudienne",           description: "Riz au poisson, légumes, sauce tomate",                     price: 4500, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80",  category: "Plats Sénégalais" },
  { id: "m6",  restaurantId: "r1", name: "Poulet Grillé",           description: "Demi-poulet grillé, sauce piquante, accompagnement",         price: 5000, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",  category: "Poulet" },
  { id: "m17", restaurantId: "r1", name: "Poulet Pané",             description: "Filets panés croustillants, sauce honey mustard",           price: 3500, image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80",  category: "Poulet" },
  { id: "m18", restaurantId: "r1", name: "Ailes de Poulet",         description: "6 ailes épicées, sauce ranch maison",                       price: 3000, image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600&auto=format&fit=crop&q=80",  category: "Poulet" },
  { id: "m7",  restaurantId: "r1", name: "Bissap Frais",            description: "Jus d'hibiscus maison, 50cl",                              price: 1000, image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&auto=format&fit=crop&q=80",  category: "Boissons" },
  { id: "m8",  restaurantId: "r1", name: "Coca-Cola",               description: "Canette 33cl",                                             price:  800, image: "https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?w=600&auto=format&fit=crop&q=80",  category: "Boissons" },
  { id: "m9",  restaurantId: "r1", name: "Thiakry",                 description: "Dessert au mil et yaourt, raisins secs",                    price: 1500, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80",  category: "Desserts" },
  { id: "m10", restaurantId: "r1", name: "Salade de Fruits",        description: "Mangue, ananas, papaye frais",                             price: 1800, image: "https://images.unsplash.com/photo-1564093497595-593b96d80180?w=600&auto=format&fit=crop&q=80",  category: "Desserts" },
];

export const getRestaurantMenu = (restaurantId: string) => {
  // For demo, return same menu items for any restaurant
  return MENU_ITEMS.map(item => ({ ...item, restaurantId }));
};

export const formatPrice = (price: number) => `${price.toLocaleString('fr-FR')} FCFA`;

export const MENU_CATEGORY_IMAGES: Record<string, string> = {
  'Populaires':      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
  'Burgers':         'https://images.unsplash.com/photo-1550317138-10000687a72b?w=600&auto=format&fit=crop&q=80',
  'Pizzas':          'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80',
  'Tacos':           'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&auto=format&fit=crop&q=80',
  'Poulet':          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
  'Plats Sénégalais':'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80',
  'Boissons':        'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&auto=format&fit=crop&q=80',
  'Desserts':        'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80',
};

export const CONDIMENTS = ['Aucun', 'Ketchup', 'Mayonnaise', 'Sauce piquante', 'Moutarde', 'Sauce barbecue', 'Sauce blanche'];

export const SUPPLEMENTS: Array<{ label: string; price: number }> = [
  { label: 'Aucun', price: 0 },
  { label: 'Fromage', price: 200 },
  { label: 'Bacon', price: 300 },
  { label: 'Œuf', price: 150 },
  { label: 'Avocat', price: 250 },
  { label: 'Double steak', price: 500 },
];
