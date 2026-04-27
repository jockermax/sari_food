import React from 'react';
import { MapPin, Store, CreditCard, Check } from 'lucide-react';

interface Props {
  current: 1 | 2 | 3;
}

const steps = [
  { num: 1, label: 'Localisation', Icon: MapPin },
  { num: 2, label: 'Restaurant', Icon: Store },
  { num: 3, label: 'Paiement', Icon: CreditCard },
];

const ProgressSteps: React.FC<Props> = ({ current }) => {
  return (
    <div className="bg-white px-4 py-3 border-b border-neutral-100">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {steps.map((s, idx) => {
          const isDone = s.num < current;
          const isActive = s.num === current;
          const Icon = s.Icon;
          return (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isDone ? 'bg-green-500 text-white' :
                  isActive ? 'bg-[#C94A2A] text-white shadow-lg shadow-[#C94A2A]/30' :
                  'bg-neutral-100 text-neutral-400'
                }`}>
                  {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={`text-[11px] mt-1 font-medium ${
                  isActive ? 'text-[#C94A2A]' : isDone ? 'text-green-600' : 'text-neutral-400'
                }`}>{s.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-4 transition-all ${
                  s.num < current ? 'bg-green-500' : 'bg-neutral-200'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressSteps;
