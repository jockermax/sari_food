import React from 'react';
import { LOGO_URL } from '@/data/sariData';

const SplashScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FF4B11] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-[#FF4B11] blur-3xl" />
      </div>
      <div className="relative z-10 flex flex-col items-center animate-fade-in">
        <div className="w-32 h-32 rounded-full bg-white overflow-hidden shadow-2xl mb-6 animate-bounce-soft">
          <img src={LOGO_URL} alt="SARI FOOD" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-white text-3xl font-extrabold tracking-tight">SARI FOOD</h1>
        <p className="text-white/80 text-sm mt-2">Votre fast food, à votre porte</p>
      </div>
      <div className="absolute bottom-12 left-0 right-0 flex justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-white/30 border-t-white animate-spin" />
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
        @keyframes bounce-soft { 0%, 100% { transform: translateY(0);} 50% { transform: translateY(-8px);} }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-bounce-soft { animation: bounce-soft 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default SplashScreen;





