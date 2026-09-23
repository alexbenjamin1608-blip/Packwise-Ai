import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Box,
  Cpu,
  BarChart3,
  ShieldCheck,
  Leaf,
  Scale,
  Menu,
  X,
  Bell,
  Sliders,
  Film,
  Compass,
  Globe,
  Mic,
  TrendingUp,
  Truck,
  Camera,
} from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, TRANSLATIONS } from '../i18n/translations';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSimpleMode: boolean;
  setIsSimpleMode: (simple: boolean) => void;
  onOpenDashboard: () => void;
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenVoiceCopilot: () => void;
  onOpenScanCamera?: () => void;
  isVoiceActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isSimpleMode,
  setIsSimpleMode,
  onOpenDashboard,
  currentLanguage = 'en',
  onLanguageChange,
  onOpenVoiceCopilot,
  onOpenScanCamera,
  isVoiceActive = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const navLinks = [
    { id: 'home', label: t.home, icon: Sparkles },
    { id: 'recommend', label: t.aiRecommend, icon: Cpu },
    { id: 'lab3d', label: t.lab3d, icon: Box },
    { id: 'materials', label: t.materials, icon: Layers },
    { id: 'shelflife', label: t.shelfLife, icon: BarChart3 },
    { id: 'map', label: t.map, icon: Compass },
    { id: 'coldchain', label: t.coldChain, icon: Truck },
    { id: 'roi', label: t.roiCalc, icon: TrendingUp },
    { id: 'compliance', label: t.compliance, icon: ShieldCheck },
    { id: 'cost', label: t.cost, icon: Scale },
    { id: 'sustainability', label: t.sustainability, icon: Leaf },
  ];

  const currentLangMeta = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#070B14]/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-cyan-400 p-[1.5px] shadow-lg shadow-amber-500/20 group-hover:shadow-cyan-500/30 transition-all duration-300">
              <div className="w-full h-full bg-[#070B14] rounded-[10px] flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-400 group-hover:text-cyan-300 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.4" strokeDasharray="2 2" />
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
                  <path d="M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-wider text-white font-['Outfit']">
                  PACKWISE <span className="bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text text-transparent">AI</span>
                </span>
                <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  INDIA v2.5
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block tracking-wide">
                Smart Packaging for a Sustainable India
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden 2xl:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 shadow-sm shadow-cyan-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-colors flex items-center gap-1.5"
                title="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>{currentLangMeta.nativeName}</span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl glass-card border border-white/15 p-1.5 shadow-2xl z-50 animate-in fade-in duration-150">
                  <div className="text-[10px] font-mono text-slate-400 px-2 py-1 uppercase border-b border-white/10 mb-1">
                    Select Indian Language
                  </div>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between text-left transition-colors ${
                        currentLanguage === lang.code
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Voice Assistant Trigger Button */}
            <button
              onClick={onOpenVoiceCopilot}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                isVoiceActive
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                  : 'bg-white/5 hover:bg-white/10 text-amber-400 border-amber-500/30'
              }`}
              title="Open PackWise Vaani Voice AI"
            >
              <Mic className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">वाणी AI</span>
              {isVoiceActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
              )}
            </button>

            {/* Live Camera Scanner Trigger Button */}
            {onOpenScanCamera && (
              <button
                onClick={onOpenScanCamera}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all bg-gradient-to-r from-cyan-500/20 to-teal-500/20 hover:from-cyan-500/30 hover:to-teal-500/30 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20"
                title="AI Live Camera Crop Scanner"
              >
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">कैमरा स्कैन</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              </button>
            )}

            {/* Farmer Simple Mode Toggle */}
            <button
              onClick={() => setIsSimpleMode(!isSimpleMode)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                isSimpleMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/30'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:border-amber-400/40 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">{t.farmerMode}</span>
              <span className="md:hidden">किसान</span>
            </button>

            {/* Futuristic Dashboard Button */}
            <button
              onClick={onOpenDashboard}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{t.dashboard}</span>
            </button>

            {/* Telemetry Alert Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotification(!showNotification)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
              </button>

              {showNotification && (
                <div className="absolute right-0 mt-3 w-80 rounded-xl glass-card border border-white/15 p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Live AI Telemetry
                    </span>
                    <span className="text-[10px] text-cyan-300 font-mono">LIVE FEED</span>
                  </div>
                  <div className="mt-3 space-y-2.5 text-xs">
                    <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-slate-200">
                      <p className="font-medium text-cyan-300">Produce Respiration Alert</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Ambient temperature at 32°C detected in transit hub. MAP micro-perforation advisory active.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-slate-200">
                      <p className="font-medium text-amber-300">FSSAI Regulation Update</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        IS 9845 migration protocol verification loaded for multilayer mono-PE.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 2xl:hidden border border-white/10"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="2xl:hidden bg-[#070B14]/98 border-b border-white/15 px-4 pt-3 pb-6 space-y-3 backdrop-blur-2xl">
          {/* Quick Actions in Mobile Drawer */}
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            {onOpenScanCamera && (
              <button
                onClick={() => {
                  onOpenScanCamera();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4 text-cyan-400" /> कैमरा स्कैन
              </button>
            )}
            <button
              onClick={() => {
                setIsSimpleMode(!isSimpleMode);
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-2"
            >
              <Sliders className="w-4 h-4 text-amber-400" /> {t.farmerMode}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-lg text-xs font-medium flex items-center gap-2 text-left ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-500/20 border border-cyan-500/40'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
