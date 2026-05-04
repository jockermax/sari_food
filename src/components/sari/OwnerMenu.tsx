import React, { useState } from 'react';

import { useAppContext } from '@/contexts/AppContext';
import { BRANCH_MENU, MENU_CATS, BranchMenuItem, OWNER_BRANCHES } from '@/data/managerData';
import { formatPrice } from '@/data/sariData';
import { 
  ArrowLeft, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  ShoppingBag, 
  X, 
  Image as ImageIcon, 
  Edit3,
  Search,
  Filter
} from 'lucide-react';

const OwnerMenu: React.FC = () => {
  const { setScreen, activeBranchId } = useAppContext();
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [items, setItems] = useState<BranchMenuItem[]>(BRANCH_MENU);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'Burgers', description: '', image: '' });

  const branch = OWNER_BRANCHES.find(b => b.id === activeBranchId);

  const filtered = activeCategory === 'Tous'
    ? items
    : items.filter(i => i.category === activeCategory);

  const toggleAvailability = (id: string) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, isAvailable: !i.isAvailable } : i));

  const available = items.filter(i => i.isAvailable).length;
  const unavailable = items.filter(i => !i.isAvailable).length;

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;
    
    if (editingItemId) {
      setItems(prev => prev.map(i => i.id === editingItemId ? {
        ...i,
        name: newItem.name,
        price: parseInt(newItem.price),
        category: newItem.category,
        description: newItem.description,
        image: newItem.image || i.image,
      } : i));
    } else {
      const added: BranchMenuItem = {
        id: Math.random().toString(),
        name: newItem.name,
        price: parseInt(newItem.price),
        category: newItem.category,
        description: newItem.description,
        image: newItem.image || 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
        isAvailable: true,
        ordersCount: 0
      };
      setItems([added, ...items]);
    }
    
    setShowAddModal(false);
  };

  const openAdd = () => {
    setEditingItemId(null);
    setNewItem({ name: '', price: '', category: 'Burgers', description: '', image: '' });
    setShowAddModal(true);
  };

  const openEdit = (item: BranchMenuItem) => {
    setEditingItemId(item.id);
    setNewItem({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
      description: item.description,
      image: item.image
    });
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => setScreen('owner-branch')}
            className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-extrabold text-neutral-900">Menu</h1>
            <p className="text-xs text-neutral-500 truncate">{branch?.name || 'Local'}</p>
          </div>
          <button onClick={openAdd} className="w-10 h-10 rounded-full bg-[#87C025] text-white flex items-center justify-center shadow-lg shadow-[#87C025]/30 active:scale-95 transition-transform">
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Summary */}
        <div className="px-5 pb-3 flex gap-3">
          <div className="flex-1 bg-green-50 rounded-xl px-3 py-2.5 flex items-center gap-2 border border-green-100">
            <CheckCircle className="w-3.5 h-3.5 text-green-600" />
            <span className="text-[11px] font-bold text-green-700 uppercase tracking-tight">{available} disponibles</span>
          </div>
          <div className="flex-1 bg-red-50 rounded-xl px-3 py-2.5 flex items-center gap-2 border border-red-100">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            <span className="text-[11px] font-bold text-red-700 uppercase tracking-tight">{unavailable} indisponibles</span>
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

      {/* Items */}
      <div className="px-5 pt-4 space-y-3">
        {filtered.map(item => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl p-4 shadow-sm border-2 transition-all ${
              item.isAvailable ? 'border-transparent' : 'border-red-100 opacity-70'
            }`}
          >
            <div className="flex gap-3">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-white opacity-80" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-sm text-neutral-900">{item.name}</h3>
                    <span className="inline-block text-[10px] font-bold text-[#87C025] bg-[#FDF6EC] px-2 py-0.5 rounded-full mt-0.5">
                      {item.category}
                    </span>
                  </div>
                  {/* Toggle switch */}
                  <button
                    onClick={() => toggleAvailability(item.id)}
                    className={`relative w-12 h-6 rounded-full transition-all flex-shrink-0 ${
                      item.isAvailable ? 'bg-[#87C025]' : 'bg-neutral-300'
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                      item.isAvailable ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>
                <p className="text-xs text-neutral-500 mt-1 line-clamp-1">{item.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-extrabold text-[#FF4B11]">{formatPrice(item.price)}</span>
                  <div className="flex items-center gap-1 text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-lg border border-neutral-100">
                    <ShoppingBag className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-tight">{item.ordersCount} ventes</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
              <span className={`text-[10px] font-extrabold uppercase tracking-wider ${item.isAvailable ? 'text-[#87C025]' : 'text-[#FF4B11]'}`}>
                {item.isAvailable ? '✓ En stock' : '✗ Rupture de stock'}
              </span>
              <button onClick={() => openEdit(item)} className="flex items-center gap-1 text-[11px] text-[#87C025] font-extrabold uppercase tracking-widest">
                MODIFIER
                <Edit3 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-neutral-900">{editingItemId ? 'Modifier l\'article' : 'Ajouter au menu'}</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 bg-neutral-100 rounded-full active:scale-90 transition-transform">
                <X className="w-5 h-5 text-neutral-600" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-neutral-700 block mb-1.5">Nom de l'article</label>
                <input 
                  type="text" 
                  required
                  value={newItem.name}
                  onChange={e => setNewItem({...newItem, name: e.target.value})}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[#87C025]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-neutral-700 block mb-1.5">Prix (FCFA)</label>
                  <input 
                    type="number" 
                    required
                    value={newItem.price}
                    onChange={e => setNewItem({...newItem, price: e.target.value})}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[#87C025]"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-neutral-700 block mb-1.5">Catégorie</label>
                  <select 
                    value={newItem.category}
                    onChange={e => setNewItem({...newItem, category: e.target.value})}
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
                  value={newItem.description}
                  onChange={e => setNewItem({...newItem, description: e.target.value})}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[#87C025] resize-none h-24"
                />
              </div>
              
              <div>
                <label className="text-sm font-semibold text-neutral-700 block mb-1.5">Image de l'article</label>
                <div className="relative w-full h-24 bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-xl flex flex-col items-center justify-center overflow-hidden hover:border-[#87C025] transition-colors">
                  {newItem.image && newItem.image.startsWith('blob:') ? (
                    <img src={newItem.image} className="absolute inset-0 w-full h-full object-cover" />
                  ) : newItem.image ? (
                    <img src={newItem.image} className="absolute inset-0 w-full h-full object-cover opacity-50" />
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
                        setNewItem({...newItem, image: URL.createObjectURL(e.target.files[0])});
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
                {editingItemId ? 'Enregistrer les modifications' : 'Ajouter au menu'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
};

export default OwnerMenu;





