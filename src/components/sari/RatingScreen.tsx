import React, { useState } from 'react';

import { useAppContext } from '@/contexts/AppContext';

const QUICK_REVIEWS = [
  'Livraison très rapide',
  'Repas délicieux',
  'Livreur sympa',
  'Commande correcte',
  'Emballage soigné',
];

const RatingScreen: React.FC = () => {
  const { currentOrder, setScreen } = useAppContext();
  const [restaurantRating, setRestaurantRating] = useState(0);
  const [livreurRating, setLivreurRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setScreen('orders'), 1800);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FDF6EC] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-5 animate-bounce-in">
          
        </div>
        <h2 className="text-2xl font-extrabold text-neutral-900 mb-2">Merci pour votre avis !</h2>
        <p className="text-neutral-500 text-sm">Votre retour aide à améliorer l'expérience SARI.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6EC] flex flex-col pb-10">
      {/* Header */}
      <div className="bg-[#FF4B11] px-5 pt-10 pb-8 text-center relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="text-4xl mb-2">🎉</div>
        <h1 className="text-white text-xl font-extrabold">Commande livrée !</h1>
        <p className="text-white/80 text-sm mt-1">
          {currentOrder?.restaurant?.name || 'Votre restaurant'} · #{currentOrder?.id}
        </p>
      </div>

      <div className="px-5 pt-5 space-y-4">
        {/* Restaurant rating */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-extrabold text-neutral-900 mb-1">Notez le restaurant</h3>
          <p className="text-xs text-neutral-500 mb-4">Qualité des plats, temps de préparation</p>
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => setRestaurantRating(n)}
                className={`text-2xl transition-transform active:scale-110 ${
                  n <= restaurantRating ? 'text-[#FF4B11]' : 'text-neutral-200'
                }`}
              >
                ★
              </button>
            ))}
          </div>
          {restaurantRating > 0 && (
            <p className="text-center text-sm font-bold text-[#FF4B11] mt-2">
              {['', 'Très décevant', 'Décevant', 'Correct', 'Très bien', 'Excellent !'][restaurantRating]}
            </p>
          )}
        </div>

        {/* Livreur rating */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100"
              alt="Livreur"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-extrabold text-neutral-900">Notez votre livreur</h3>
              <p className="text-xs text-neutral-500">Moussa D. · ⭐ 4.9 (142 livraisons)</p>
            </div>
          </div>
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => setLivreurRating(n)}
                className={`text-2xl transition-transform active:scale-110 ${
                  n <= livreurRating ? 'text-[#FF4B11]' : 'text-neutral-200'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Quick tags */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-extrabold text-neutral-900 mb-3">Ce que vous avez apprécié</h3>
          <div className="flex flex-wrap gap-2">
            {QUICK_REVIEWS.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-[#FF4B11] text-white shadow-md shadow-[#FF4B11]/25'
                    : 'bg-neutral-100 text-neutral-700'
                }`}
              >
                {selectedTags.includes(tag) ? '✓ ' : ''}{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-extrabold text-neutral-900 mb-3">Commentaire (optionnel)</h3>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Partagez votre expérience en détail..."
            rows={3}
            className="w-full bg-[#FDF6EC] rounded-xl px-4 py-3 text-sm outline-none resize-none"
          />
        </div>
      </div>

      <div className="flex-1" />
      {/* Submit */}
      <div className="sticky bottom-0 bg-white border-t border-neutral-100 px-5 py-4 z-20">
        <button
          onClick={handleSubmit}
          disabled={restaurantRating === 0}
          className="w-full bg-[#FF4B11] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#FF4B11]/30 active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
        >
          Envoyer mon avis
        </button>
        <button
          onClick={() => setScreen('orders')}
          className="w-full text-center text-sm text-neutral-400 font-medium mt-2 py-2"
        >
          Passer
        </button>
      </div>
    </div>
  );
};

export default RatingScreen;





