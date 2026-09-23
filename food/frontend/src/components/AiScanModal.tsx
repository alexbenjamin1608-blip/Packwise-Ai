import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';

interface AiScanModalProps {
  isOpen: boolean;
  onComplete: () => void;
  foodName: string;
}

export const AiScanModal: React.FC<AiScanModalProps> = ({ isOpen, onComplete, foodName }) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const steps = [
    'Scanning Food Biochemical Properties...',
    'Evaluating Climate & Regional Humidity...',
    'Calculating Post-Harvest Respiration Rate...',
    'Querying Indian Polymer & Barrier Database...',
    'Matching OTR & WVTR Permeability Requirements...',
    'Simulating Micro-Perforation & Shelf-Life Model...',
    'Verifying FSSAI (Packaging) 2018 & BIS Standards...',
  ];

  useEffect(() => {
    if (!isOpen) {
      setActiveStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 600);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl glass-card border border-cyan-500/40 p-6 sm:p-8 shadow-2xl shadow-cyan-500/20 text-center overflow-hidden">
        {/* Background Rotating Mandala & Radar Grid */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-80 h-80 rounded-full border border-cyan-400 animate-ping" />
          <div className="w-96 h-96 rounded-full border border-amber-400 animate-spin-slow" />
        </div>

        {/* Central 3D Scanning Ring */}
        <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/40 border-t-cyan-400 animate-spin" />
          <div className="absolute inset-2 rounded-full border-2 border-amber-400/40 border-b-amber-400 animate-spin-slow" />
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-600 to-amber-500 flex items-center justify-center shadow-lg shadow-cyan-500/40">
            <Cpu className="w-7 h-7 text-white animate-pulse" />
          </div>
        </div>

        <div className="relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            AI DIAGNOSTIC ENGINE ACTIVE
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-3 mb-1 font-['Outfit']">
            Synthesizing Packaging Matrix
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Analyzing optimal barrier structures for <strong className="text-amber-300">{foodName}</strong>
          </p>

          {/* Diagnostics Progress Checklist */}
          <div className="mt-6 space-y-2 text-left bg-black/50 p-4 rounded-2xl border border-white/10">
            {steps.map((text, idx) => {
              const isDone = idx < activeStepIndex;
              const isCurrent = idx === activeStepIndex;
              return (
                <div
                  key={text}
                  className={`flex items-center justify-between text-xs transition-colors duration-200 ${
                    isDone
                      ? 'text-emerald-300 font-medium'
                      : isCurrent
                      ? 'text-cyan-300 font-semibold'
                      : 'text-slate-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                    )}
                    <span>{text}</span>
                  </span>
                  <span className="font-mono text-[10px]">
                    {isDone ? '✓ VERIFIED' : isCurrent ? 'ANALYZING' : 'PENDING'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-5 text-[11px] text-slate-400 font-mono">
            PACKWISE AI HEURISTIC MODEL • INDIA ED.
          </div>
        </div>
      </div>
    </div>
  );
};
