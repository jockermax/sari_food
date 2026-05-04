import React from 'react';


interface Props {
  current: 1 | 2 | 3;
}

const steps = [
  { num: 1, label: 'Localisation' },
  { num: 2, label: 'Restaurant' },
  { num: 3, label: 'Paiement' },
];

const ProgressSteps: React.FC<Props> = ({ current }) => {
  return (
    <div className="bg-white px-4 py-3 border-b border-neutral-100">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {steps.map((s, idx) => {
          const isDone = s.num < current;
          const isActive = s.num === current;
          return (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isDone ? 'bg-[#87C025] text-white' :
                  isActive ? 'bg-[#FF4B11] text-white shadow-lg shadow-[#FF4B11]/30' :
                  'bg-neutral-100 text-neutral-400'
                }`}>
                  <span className="text-xs font-bold">
                    {isDone ? '✓' : s.num}
                  </span>
                </div>
                <span className={`text-[11px] mt-1 font-medium ${
                  isActive ? 'text-[#FF4B11]' : isDone ? 'text-[#87C025]' : 'text-neutral-400'
                }`}>{s.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-4 transition-all ${
                  s.num < current ? 'bg-[#87C025]' : 'bg-neutral-200'
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




