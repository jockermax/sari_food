import React, { useState } from 'react';

import { useAppContext } from '@/contexts/AppContext';

const slides = [
  {
    icon: null,
    color: '#FF4B11',
    title: 'Trouvez par localisation',
    desc: "Sélectionnez votre ville et votre quartier. Fini les confusions entre restaurants qui portent le même nom.",
    img: 'https://images.unsplash.com/photo-1506484381205-f7945653044d?w=800',
  },
  {
    icon: null,
    color: '#FF4B11',
    title: 'Choisissez votre restaurant',
    desc: "Parcourez les fast foods près de chez vous, consultez les menus et les avis en toute simplicité.",
    img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
  },
  {
    icon: null,
    color: '#87C025',
    title: 'Commandez & Payez',
    desc: "Payez avec Wave, Orange Money, Free Money ou en espèces. Suivez votre commande en temps réel.",
    img: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800',
  },
];

const Onboarding: React.FC = () => {
  const { setScreen } = useAppContext();
  const [idx, setIdx] = useState(0);

  const next = () => {
    if (idx < slides.length - 1) setIdx(idx + 1);
    else setScreen('role-select');
  };

  const slide = slides[idx];

  return (
    <div className="min-h-screen bg-[#FDF6EC] flex flex-col">
      <div className="flex justify-between items-center p-5">
        <button
          onClick={() => setScreen('role-select')}
          className="flex items-center gap-1.5 bg-[#FF4B11]/15 px-3 py-1.5 rounded-full"
        >
          <span className="w-2 h-2 rounded-full bg-[#FF4B11]" />
          <span className="text-xs font-bold text-[#FF4B11]">MODE DÉMO</span>
        </button>
        <button
          onClick={() => setScreen('role-select')}
          className="text-neutral-500 text-xs font-extrabold uppercase tracking-widest hover:text-[#FF4B11]"
        >
          Passer
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-6">
        <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden mb-8 shadow-xl">
          <img src={slide.img} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div 
            className="absolute top-5 left-5 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg font-bold text-white text-xl"
            style={{ backgroundColor: slide.color }}
          >
            {idx + 1}
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-neutral-900 text-center mb-3 px-4">
          {slide.title}
        </h2>
        <p className="text-neutral-600 text-center text-[15px] leading-relaxed max-w-sm">
          {slide.desc}
        </p>

        <div className="flex gap-2 mt-8">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === idx ? 'w-8 bg-[#FF4B11]' : 'w-2 bg-neutral-300'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="px-6 pb-8">
        <button
          onClick={next}
          className="w-full bg-[#FF4B11] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#FF4B11]/30 active:scale-[0.98] transition-transform"
        >
          <span className="uppercase tracking-widest">
            {idx === slides.length - 1 ? 'Commencer' : 'Suivant'}
          </span>
          <span className="ml-2 text-lg">→</span>
        </button>
      </div>
    </div>
  );
};

export default Onboarding;





