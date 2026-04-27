import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Phone } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { LOGO_URL } from '@/data/sariData';

const AuthScreen: React.FC = () => {
  const { setScreen, phone, setPhone, setIsAuthenticated } = useAppContext();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [localPhone, setLocalPhone] = useState(phone || '');
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === 'otp') inputsRef.current[0]?.focus();
  }, [step]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (localPhone.replace(/\s/g, '').length < 9) return;
    setPhone(localPhone);
    setStep('otp');
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 3) inputsRef.current[i + 1]?.focus();
    if (next.every(d => d !== '')) {
      setTimeout(() => {
        setIsAuthenticated(true);
        setScreen('role-select');
      }, 400);
    }
  };

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-5 py-4 flex items-center">
        <button
          onClick={() => step === 'otp' ? setStep('phone') : setScreen('onboarding')}
          className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-700" />
        </button>
      </div>

      <div className="flex-1 px-6 pb-6 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl overflow-hidden">
            <img src={LOGO_URL} alt="SARI" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-neutral-900">SARI FOOD</h1>
            <p className="text-xs text-neutral-500">Commande simple & rapide</p>
          </div>
        </div>

        {step === 'phone' ? (
          <>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Bienvenue 👋</h2>
            <p className="text-neutral-500 mb-8">Entrez votre numéro pour recevoir un code de vérification par SMS.</p>

            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-neutral-700 mb-2 block">
                  Numéro de téléphone
                </label>
                <div className="flex items-center bg-[#FDF6EC] rounded-2xl border-2 border-transparent focus-within:border-[#C94A2A] transition-all">
                  <div className="flex items-center gap-2 pl-4 pr-3 border-r border-neutral-200 h-14">
                    <span className="text-lg">🇸🇳</span>
                    <span className="text-neutral-700 font-medium">+221</span>
                  </div>
                  <input
                    type="tel"
                    value={localPhone}
                    onChange={e => setLocalPhone(e.target.value.replace(/[^\d\s]/g, ''))}
                    placeholder="77 123 45 67"
                    className="flex-1 h-14 bg-transparent outline-none px-4 text-neutral-900 font-medium"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={localPhone.replace(/\s/g, '').length < 9}
                className="w-full bg-[#C94A2A] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#C94A2A]/30 active:scale-[0.98] transition-all disabled:opacity-40 disabled:shadow-none"
              >
                Recevoir le code
              </button>

              <p className="text-xs text-neutral-400 text-center leading-relaxed">
                En continuant, vous acceptez les <span className="text-[#C94A2A] font-medium">Conditions d'utilisation</span> et la <span className="text-[#C94A2A] font-medium">Politique de confidentialité</span>.
              </p>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Vérification</h2>
            <p className="text-neutral-500 mb-8">
              Entrez le code à 4 chiffres envoyé au <span className="font-semibold text-neutral-700">+221 {localPhone}</span>
            </p>

            <div className="flex justify-center gap-3 mb-8">
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={el => inputsRef.current[i] = el}
                  type="tel"
                  maxLength={1}
                  value={d}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleKey(i, e)}
                  className="w-16 h-16 text-center text-2xl font-bold bg-[#FDF6EC] rounded-2xl border-2 border-transparent focus:border-[#C94A2A] outline-none transition-all"
                />
              ))}
            </div>

            <div className="text-center mb-6">
              <p className="text-sm text-neutral-500">
                Code non reçu ? <button className="text-[#C94A2A] font-semibold">Renvoyer</button>
              </p>
              <p className="text-xs text-neutral-400 mt-2">Astuce : entrez n'importe quels 4 chiffres</p>
            </div>

            <button
              onClick={() => { setIsAuthenticated(true); setScreen('role-select'); }}
              className="w-full bg-[#C94A2A] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#C94A2A]/30 active:scale-[0.98] transition-all"
            >
              Vérifier
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
