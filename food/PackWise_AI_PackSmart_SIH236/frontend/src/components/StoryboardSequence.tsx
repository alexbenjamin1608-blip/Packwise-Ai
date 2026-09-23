import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Maximize2, Minimize2, Sparkles, Compass, ShieldCheck, Box } from 'lucide-react';

interface StoryboardSequenceProps {
  onSelectAction?: (action: string) => void;
}

interface StoryPhase {
  name: string;
  frames: [number, number];
  title: string;
  badge: string;
  description: string;
  scientificContext: string;
}

const PHASES: StoryPhase[] = [
  {
    name: 'Indian Farm Harvest',
    frames: [1, 12],
    title: 'Indian Farm & Harvest at Sunrise',
    badge: 'Phase 01 / Agriculture',
    description: 'Fresh Alphonso mangoes harvested in traditional woven cane baskets across the Konkan agricultural plains under morning sunrise.',
    scientificContext: 'High post-harvest moisture (82%) and high respiration rate (40-60 mg CO₂/kg·h) initiate rapid climacteric ripening and weight loss within 72 hours without barrier intervention.',
  },
  {
    name: 'Traditional to Bio-Layers',
    frames: [13, 22],
    title: 'Traditional Basket to Exploded Packaging Layers',
    badge: 'Phase 02 / Biomimicry',
    description: 'Transitioning from ancient breathable jute and cane baskets into engineered multi-layer barrier film structures with sacred geometric mandala telemetry.',
    scientificContext: 'Exploding outer print protection (BOPET), tie adhesion layers, and food-contact sealant polyethylene (LLDPE) engineered to mimic natural fruit exocarp defense.',
  },
  {
    name: 'Molecular Barrier Lab',
    frames: [23, 34],
    title: 'OTR & WVTR Molecular Permeation Analysis',
    badge: 'Phase 03 / Physics Lab',
    description: 'Dark futuristic 3D packaging laboratory analyzing gaseous molecules ($O_2, CO_2, H_2O$) penetrating polymeric barrier membranes.',
    scientificContext: 'Targeting balanced Oxygen Transmission Rate (<60 cc/m²·day) and Water Vapor Transmission Rate (<4.5 g/m²·day) to suppress anaerobic ethanol off-flavors while preventing shrinkage.',
  },
  {
    name: 'Cold-Chain MAP Chamber',
    frames: [35, 43],
    title: 'Modified Atmosphere Packaging (MAP) Chamber',
    badge: 'Phase 04 / Controlled Atmosphere',
    description: 'Mangoes inside a regulated cold storage chamber (12°C, 90% RH) bathed in controlled gas balance (5% O₂, 10% CO₂, 85% N₂).',
    scientificContext: 'Sub-ambient oxygen inhibits polyphenol oxidase (enzymatic browning) and slows ACC oxidase ethylene biosynthesis, extending safe commercial shelf-life by 300%.',
  },
  {
    name: 'PackWise AI Dashboard',
    frames: [44, 50],
    title: 'PackWise AI Command Center & Verification',
    badge: 'Phase 05 / AI Intelligence',
    description: 'The definitive AI dashboard synthesizing 94% compatibility, 18-day freshness window, FSSAI compliance, and Indian cost optimization.',
    scientificContext: 'Real-time telemetry verification integrating BIS migration standards (IS 9845) with life-cycle eco scores for sustainable Indian distribution.',
  },
];

export const StoryboardSequence: React.FC<StoryboardSequenceProps> = () => {
  const [currentFrame, setCurrentFrame] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(300); // ms per frame
  const containerRef = useRef<HTMLDivElement>(null);

  const totalFrames = 50;

  // Format frame number with leading zeroes: ezgif-frame-001.jpg
  const getFrameUrl = (frameNum: number) => {
    const padded = String(frameNum).padStart(3, '0');
    return `/frames/ezgif-frame-${padded}.jpg`;
  };

  // Preload nearby frames (±3) for silky smooth transitions
  useEffect(() => {
    const framesToPreload = [
      currentFrame,
      currentFrame + 1 > totalFrames ? 1 : currentFrame + 1,
      currentFrame + 2 > totalFrames ? 2 : currentFrame + 2,
      currentFrame - 1 < 1 ? totalFrames : currentFrame - 1,
    ];

    framesToPreload.forEach((num) => {
      const img = new Image();
      img.src = getFrameUrl(num);
    });
  }, [currentFrame]);

  // Playback timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentFrame((prev) => (prev >= totalFrames ? 1 : prev + 1));
      }, playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  // Determine current active phase
  const currentPhase = PHASES.find(
    (p) => currentFrame >= p.frames[0] && currentFrame <= p.frames[1]
  ) || PHASES[0];

  // Jump to specific phase
  const handlePhaseClick = (phase: StoryPhase) => {
    setCurrentFrame(phase.frames[0]);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Interactive Visual Storyboard</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">50 High-Resolution Concept Frames</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            From Indian Soil to <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-cyan-400 bg-clip-text text-transparent">AI Molecular Packaging</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-1.5">
            Explore the continuous visual journey from sunrise harvest in rural India to cutting-edge barrier film synthesis and MAP cold-chain science.
          </p>
        </div>

        {/* Phase jump chips */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {PHASES.map((p, idx) => {
            const isPhaseActive = currentPhase.name === p.name;
            return (
              <button
                key={p.name}
                onClick={() => handlePhaseClick(p)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isPhaseActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/30'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                0{idx + 1}. {p.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Visual Player Card */}
      <div
        ref={containerRef}
        className="relative rounded-2xl glass-card border border-white/15 overflow-hidden shadow-2xl bg-black/60"
      >
        {/* Aspect Ratio 16:9 Image Container */}
        <div className="relative w-full aspect-video sm:aspect-[16/9] overflow-hidden bg-slate-950 flex items-center justify-center">
          {/* Main Frame with smooth transition */}
          <img
            key={currentFrame}
            src={getFrameUrl(currentFrame)}
            alt={`PackWise Storyboard Frame ${currentFrame}`}
            className="w-full h-full object-contain select-none transition-opacity duration-150"
            onError={(e) => {
              // Fallback to frame 1 or a placeholder
              (e.target as HTMLImageElement).src = '/frames/ezgif-frame-001.jpg';
            }}
          />

          {/* Top Holographic Overlay HUD */}
          <div className="absolute top-3 left-3 sm:top-5 sm:left-5 flex items-center gap-2 sm:gap-3 pointer-events-none">
            <span className="px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-mono font-bold bg-black/70 text-cyan-400 border border-cyan-500/30 backdrop-blur-md">
              FRAME {String(currentFrame).padStart(2, '0')} / {totalFrames}
            </span>
            <span className="px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
              {currentPhase.badge}
            </span>
          </div>

          {/* Top Right Controls */}
          <div className="absolute top-3 right-3 sm:top-5 sm:right-5 flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white border border-white/15 backdrop-blur-md transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Golden AI Energy Halo / Mandala Motif Accent (Bottom Right watermark) */}
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 pointer-events-none opacity-40">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400/80">
              <Box className="w-3.5 h-3.5" />
              <span>PACKWISE AI REFERENCE SEQUENCE</span>
            </div>
          </div>
        </div>

        {/* Player Controls & Scrubber */}
        <div className="p-4 sm:p-5 bg-[#090E1A]/90 border-t border-white/10">
          {/* Progress / Timeline Scrubber */}
          <div className="space-y-1.5 mb-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-cyan-300 font-semibold">{currentPhase.title}</span>
              <span className="font-mono text-[11px] text-slate-400">
                {Math.round((currentFrame / totalFrames) * 100)}% Progress
              </span>
            </div>

            <div className="relative flex items-center group">
              <input
                type="range"
                min={1}
                max={totalFrames}
                value={currentFrame}
                onChange={(e) => setCurrentFrame(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 group-hover:h-2.5 transition-all"
              />
            </div>

            {/* Timeline Phase Marks */}
            <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
              {PHASES.map((p) => (
                <span
                  key={p.name}
                  onClick={() => setCurrentFrame(p.frames[0])}
                  className="cursor-pointer hover:text-cyan-300 transition-colors hidden sm:inline"
                >
                  F{p.frames[0]}: {p.name}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Buttons Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Play, Step, and Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentFrame((prev) => (prev <= 1 ? totalFrames : prev - 1))}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
                title="Previous Frame (Left Arrow)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-2 bg-gradient-to-r from-amber-500 to-cyan-500 text-white shadow-md shadow-amber-500/20 hover:opacity-95 transition-opacity"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" /> Play Sequence
                  </>
                )}
              </button>

              <button
                onClick={() => setCurrentFrame((prev) => (prev >= totalFrames ? 1 : prev + 1))}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
                title="Next Frame (Right Arrow)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Playback Speed Controls */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="text-[11px]">Speed:</span>
              {[
                { label: '0.5x', speed: 500 },
                { label: '1x', speed: 280 },
                { label: '2x', speed: 140 },
              ].map((s) => (
                <button
                  key={s.label}
                  onClick={() => setPlaybackSpeed(s.speed)}
                  className={`px-2 py-1 rounded text-[11px] font-mono font-medium transition-colors ${
                    playbackSpeed === s.speed
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Educational Storyboard Narrative Card */}
        <div className="p-4 sm:p-6 bg-gradient-to-br from-[#0B132B]/80 to-[#070B14]/90 border-t border-white/10 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Compass className="w-3.5 h-3.5" /> Visual Narrative
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-['Outfit']">
              {currentPhase.title}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {currentPhase.description}
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20">
            <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Food Science & Physics
            </div>
            <p className="text-xs text-cyan-100/90 leading-relaxed font-sans">
              {currentPhase.scientificContext}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
