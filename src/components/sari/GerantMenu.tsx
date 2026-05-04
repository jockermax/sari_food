import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const menuSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères.'),
  price: z.number({ invalid_type_error: 'Prix invalide' }).min(1, 'Le prix doit être supérieur à 0.'),
  category: z.string(),
  description: z.string().optional(),
});
type MenuFormValues = z.infer<typeof menuSchema>;
import { useAppContext } from '@/contexts/AppContext';
import { BRANCH_MENU as MANAGER_MENU, BranchMenuItem as ManagerMenuItem } from '@/data/managerData';
import { formatPrice } from '@/data/sariData';
import { 
  ArrowLeft, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  ShoppingBag, 
  X, 
  XCircle,
  Image as ImageIcon, 
  Edit3,
  Search,
  Filter,
  Check
} from 'lucide-react';

const MENU_CATS = ['Tous', 'Burgers', 'Plats Sénégalais', 'Poulet', 'Boissons', 'Desserts'];

const GerantMenu: React.FC = () => {
  const { setScreen } = useAppContext();
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [items, setItems] = useState<ManagerMenuItem[]>(MANAGER_MENU);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemImage, setItemImage] = useState('');

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<MenuFormValues>({
    resolver: zodResolver(menuSchema),
    defaultValues: { category: 'Burgers' }
  });

  const onSubmit = (data: MenuFormValues) => {
    if (editingItemId) {
      setItems(prev => prev.map(i => i.id === editingItemId ? {
        ...i,
        name: data.name,
        price: data.price,
        category: data.category,
        description: data.description || '',
        image: itemImage || i.image,
      } : i));
    } else {
      const added: ManagerMenuItem = {
        id: Math.random().toString(),
        name: data.name,
        price: data.price,
        category: data.category,
        description: data.description || '',
        image: itemImage || 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
        isAvailable: true,
        ordersCount: 0
      };
      setItems([added, ...items]);
    }
    
    setShowAddModal(false);
  };

  const openAdd = () => {
    setEditingItemId(null);
    reset({ name: '', price: undefined, category: 'Burgers', description: '' });
    setItemImage('');
    setShowAddModal(true);
  };

  const openEdit = (item: ManagerMenuItem) => {
    setEditingItemId(item.id);
    reset({
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description,
    });
    setItemImage(item.image);
    setShowAddModal(true);
  };

  const filtered = activeCategory === 'Tous'
    ? items
    : items.filter(i => i.category === activeCategory);

  const toggleAvailability = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, isAvailable: !i.isAvailable } : i));
  };

  const available = items.filter(i => i.isAvailable).length;
  const unavailable = items.filter(i => !i.isAvailable).length;

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 border-b border-neutral-100 shadow-sm">
        <div className="px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => setScreen('gerant-dashboard')}
            className="w-11 h-11 rounded-2xl bg-neutral-100 flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-900" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-black text-neutral-900 uppercase tracking-tighter">Gestion du Menu</h1>
            <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mt-0.5">Personnalisez votre carte</p>
          </div>
          <button 
            onClick={openAdd}
            className="w-11 h-11 rounded-2xl bg-[#87C025] text-white flex items-center justify-center shadow-lg shadow-[#87C025]/30 active:scale-90 transition-transform"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Summary bar */}
        <div className="px-5 py-3 flex gap-3">
          <div className="flex-1 bg-green-50/50 rounded-2xl px-4 py-3 flex items-center gap-2 border border-green-100">
            <div className="w-6 h-6 rounded-lg bg-[#87C025] flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
            </div>
            <span className="text-[10px] font-black text-[#87C025] uppercase tracking-wider">{available} Actifs</span>
          </div>
          <div className="flex-1 bg-red-50/50 rounded-2xl px-4 py-3 flex items-center gap-2 border border-red-100">
            <div className="w-6 h-6 rounded-lg bg-[#FF4B11] flex items-center justify-center">
              <X className="w-3.5 h-3.5 text-white stroke-[3]" />
            </div>
            <span className="text-[10px] font-black text-[#FF4B11] uppercase tracking-wider">{unavailable} Hors stock</span>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto px-5 pb-3 scrollbar-hide">
          {MENU_CATS.map(c => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === c
                  ? 'bg-[#87C025] text-white shadow-md'
                  : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Items list */}
      <div className="px-5 pt-4 space-y-3">
        {filtered.map(item => (
          <div
            key={item.id}
            className={`bg-white rounded-3xl p-5 shadow-sm border transition-all ${
              item.isAvailable ? 'border-neutral-100 hover:shadow-md' : 'border-red-100 opacity-60'
            }`}
          >
            <div className="flex gap-4">
              {/* Image */}
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-red-600/20 backdrop-blur-[2px] flex items-center justify-center">
                    <XCircle className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                )}
              </div>
...
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-base text-neutral-900 leading-tight truncate">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-block text-[9px] font-black text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-lg uppercase tracking-widest">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  {/* Toggle */}
                  <button
                    onClick={() => toggleAvailability(item.id)}
                    className="flex-shrink-0 active:scale-90 transition-transform"
                  >
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all ${
                      item.isAvailable 
                        ? 'bg-[#FF4B11]/5 border-[#FF4B11]/10 text-[#FF4B11]' 
                        : 'bg-[#87C025]/5 border-[#87C025]/10 text-[#87C025]'
                    }`}>
                      {item.isAvailable ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                    </div>
                  </button>
                </div>

                <p className="text-xs font-bold text-neutral-400 mt-2 line-clamp-1 italic">"{item.description}"</p>

                <div className="flex items-center justify-between mt-3">
                  <span className="font-black text-lg text-[#FF4B11]">{formatPrice(item.price)}</span>
                  <div className="flex items-center gap-1.5 text-neutral-400 bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-100">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-tight">{item.ordersCount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status label */}
            <div className="mt-4 pt-4 border-t border-dashed border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${item.isAvailable ? 'bg-[#87C025] animate-pulse' : 'bg-red-500'}`} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${item.isAvailable ? 'text-[#87C025]' : 'text-red-500'}`}>
                  {item.isAvailable ? 'Actif' : 'Masqué'}
                </span>
              </div>
              <button onClick={() => openEdit(item)} className="flex items-center gap-2 px-4 py-2 bg-neutral-50 rounded-xl text-[10px] text-neutral-600 font-black uppercase tracking-widest hover:bg-neutral-100 transition-colors">
                Modifier
                <Edit3 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-neutral-900">{editingItemId ? 'Modifier l\'article' : 'Ajouter au menu'}</h2>
              <button onClick={() => { setShowAddModal(false); reset(); }} className="p-2 bg-neutral-100 rounded-full active:scale-90 transition-transform">
                <X className="w-5 h-5 text-neutral-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-neutral-700 block mb-1.5">Nom de l'article</label>
                <input 
                  type="text" 
                  {...register('name')}
                  className={`w-full bg-neutral-50 border ${errors.name ? 'border-red-500' : 'border-neutral-200'} rounded-xl px-4 py-3 outline-none focus:border-[#87C025]`}
                  placeholder="Ex: Burger Royal"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-neutral-700 block mb-1.5">Prix (FCFA)</label>
                  <input 
                    type="number" 
                    {...register('price', { valueAsNumber: true })}
                    className={`w-full bg-neutral-50 border ${errors.price ? 'border-red-500' : 'border-neutral-200'} rounded-xl px-4 py-3 outline-none focus:border-[#87C025]`}
                    placeholder="Ex: 3500"
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-semibold text-neutral-700 block mb-1.5">Catégorie</label>
                  <select 
                    {...register('category')}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[#87C025]"
                  >
                    {MENU_CATS.filter(c => c !== 'Tous').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-700 block mb-1.5">Description</label>
                <textarea 
                  {...register('description')}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[#87C025] resize-none h-24"
                  placeholder="Description du plat..."
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-700 block mb-1.5">Image de l'article</label>
                <div className="relative w-full h-24 bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-xl flex flex-col items-center justify-center overflow-hidden hover:border-[#87C025] transition-colors">
                  {itemImage && itemImage.startsWith('blob:') ? (
                    <img src={itemImage} className="absolute inset-0 w-full h-full object-cover" />
                  ) : itemImage ? (
                    <img src={itemImage} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                  ) : (
                    <>
                      <ImageIcon className="w-6 h-6 text-neutral-300 mb-1" />
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Importer une photo</span>
                    </>
                  )}
                  <input 
                    type="file" accept="image/*"
                    onChange={e => {
                      if (e.target.files?.[0]) {
                        setItemImage(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#87C025] text-white font-extrabold py-4 rounded-2xl mt-4 shadow-lg shadow-[#87C025]/30 active:scale-[0.98] transition-transform uppercase tracking-wider text-sm"
              >
                {editingItemId ? 'Enregistrer les modifications' : 'Ajouter l\'article'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up { from { transform: translateY(100%);} to { transform: translateY(0);} }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
};

export default GerantMenu;





