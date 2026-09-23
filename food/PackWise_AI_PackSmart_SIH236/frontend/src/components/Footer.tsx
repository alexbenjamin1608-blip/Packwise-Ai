import React from 'react';
import { Box, Sparkles, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050811] border-t border-white/10 pt-12 pb-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-cyan-400 p-[1px]">
                <div className="w-full h-full bg-[#070B14] rounded-[7px] flex items-center justify-center">
                  <Box className="w-3.5 h-3.5 text-amber-400" />
                </div>
              </div>
              <span className="font-extrabold text-base text-white font-['Outfit'] tracking-wider">
                PACKWISE <span className="bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text text-transparent">AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Intelligent packaging recommendations bridging Indian agriculture, post-harvest respiration science, polymer physics, FSSAI compliance, and sustainability.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
              <span>DESIGNED FOR INDIA</span>
              <span>•</span>
              <span>50-FRAME VISUAL SEQUENCE SOURCE</span>
            </div>
          </div>

          {/* Col 2: Regulatory & Standards */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Indian Standards (BIS)
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>IS 9845 — Overall Migration Limits</li>
              <li>IS 10146 — Polyethylene Food Contact</li>
              <li>IS 10142 — Polypropylene Films</li>
              <li>IS 12252 — PET Food Safety</li>
              <li>IS 15392 — Aluminium Barrier Foil</li>
              <li>PWM Rules 2022 — Extended Producer Responsibility</li>
            </ul>
          </div>

          {/* Col 3: Tech Stack & Architecture */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Technology Stack
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>React 19 + TypeScript + Vite</li>
              <li>Tailwind CSS (Engineered Glassmorphism)</li>
              <li>Three.js 3D Packaging PBR Lab</li>
              <li>Recharts Scientific Analytics</li>
              <li>GS1 Digital QR Pass</li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} PACKWISE AI. Developed for Indian Food Processing & Cold-Chain Logistics.
          </p>
          <p className="flex items-center gap-1">
            Built for sustainable food systems in India <Heart className="w-3 h-3 text-rose-500 fill-current" />
          </p>
        </div>
      </div>
    </footer>
  );
};
