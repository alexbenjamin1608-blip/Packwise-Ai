import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { BIS_STANDARDS } from '../data/complianceStandards';

export const ComplianceChecker: React.FC = () => {
  const [selectedStandard, setSelectedStandard] = useState(BIS_STANDARDS[0]);

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>FSSAI & BIS Regulatory Module</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Indian Food Safety Conformity</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            India Food Packaging <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Compliance Engine</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-1.5">
            Verification protocols under FSSAI (Packaging) Regulations 2018, Bureau of Indian Standards (BIS), and Plastic Waste Management Rules 2022.
          </p>
        </div>

        {/* Status Legend */}
        <div className="flex items-center gap-3 bg-black/40 p-2.5 rounded-2xl border border-white/10 text-xs">
          <div className="flex items-center gap-1 text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified
          </div>
          <div className="flex items-center gap-1 text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5" /> Verify
          </div>
          <div className="flex items-center gap-1 text-rose-300">
            <XCircle className="w-3.5 h-3.5" /> Not Suitable
          </div>
        </div>
      </div>

      {/* Mandatory Prominent Legal Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-xs text-amber-200/90 leading-relaxed mb-8 flex items-start gap-3 shadow-lg">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-bold uppercase tracking-wider block mb-1">
            Mandatory Statutory Verification Notice
          </strong>
          Verify current FSSAI requirements, specific overall migration limits (OML), heavy metal testing (IS 9845), and applicable conformity/testing documentation from NABL-accredited laboratories before commercial food packaging use.
        </div>
      </div>

      {/* Grid of Verification Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            title: 'Food-Contact Suitability',
            desc: 'Direct food contact virgin polymer conformity per IS 10146 / IS 10142',
            status: 'Verified in database',
            type: 'primary',
          },
          {
            title: 'Migration Testing (OML)',
            desc: 'Simulant testing (3% acetic acid, 10% ethanol, n-heptane) < 60 mg/kg',
            status: 'Verified in database',
            type: 'migration',
          },
          {
            title: 'Multilayer & Tie Layers',
            desc: 'Solventless adhesive cure & barrier integrity without NIAS migration',
            status: 'Requires verification',
            type: 'multilayer',
          },
          {
            title: 'PWM Rules 2022 (EPR)',
            desc: 'Minimum thickness compliance (>50 µm / >120 µm) & EPR certificate audit',
            status: 'Verified in database',
            type: 'environmental',
          },
        ].map((pillar) => (
          <div key={pillar.title} className="p-5 rounded-2xl glass-card border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                {pillar.type}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                pillar.status === 'Verified in database'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {pillar.status === 'Verified in database' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                {pillar.status}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mt-1">{pillar.title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
          </div>
        ))}
      </div>

      {/* BIS Standards Interactive Library */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Standards List (5 Cols) */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase mb-1">
            Bureau of Indian Standards (BIS) Standards
          </div>
          {BIS_STANDARDS.map((std) => {
            const isSelected = selectedStandard.code === std.code;
            return (
              <div
                key={std.code}
                onClick={() => setSelectedStandard(std)}
                className={`p-3.5 rounded-2xl cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-400 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white font-mono">{std.code}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300">
                    Active Indian Standard
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 line-clamp-1">{std.title}</p>
                <span className="inline-block mt-2 text-[10px] font-mono text-cyan-300">
                  Key: {std.complianceKey}
                </span>
              </div>
            );
          })}
        </div>

        {/* Standard Detail Card (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/15 shadow-2xl space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[11px] font-mono uppercase text-emerald-400 font-bold">
                  BIS Standard Specification
                </span>
                <h3 className="text-2xl font-extrabold text-white font-mono mt-0.5">
                  {selectedStandard.code}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified in Database
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-200">Standard Title:</h4>
              <p className="text-xs sm:text-sm text-white mt-1 leading-relaxed">
                {selectedStandard.title}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1.5">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                Scope & Analytical Requirements:
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedStandard.scope}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
              <span className="text-slate-400">Primary Compliance Metric:</span>
              <span className="font-mono text-amber-300 font-bold">{selectedStandard.complianceKey}</span>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 leading-relaxed italic">
              *Certification note: Packaging manufacturers must submit batch test certificates from FSSAI recognized/NABL accredited test laboratories establishing compliance with this code.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
