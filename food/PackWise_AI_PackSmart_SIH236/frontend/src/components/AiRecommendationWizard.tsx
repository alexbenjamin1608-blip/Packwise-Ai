import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Search,
  Cpu,
  Sparkles,
  Thermometer,
  Truck,
  Leaf,
  Layers,
  Check,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { RecommendationInput, RecommendationResultData, IndiaRegion } from '../types/packaging';
import { INDIAN_COMMODITIES, REGIONS_INFO } from '../data/indianCommodities';
import { runPackagingRecommendation } from '../utils/recommendationEngine';
import { AiScanModal } from './AiScanModal';

interface AiRecommendationWizardProps {
  onRecommendationGenerated: (result: RecommendationResultData) => void;
}

export const AiRecommendationWizard: React.FC<AiRecommendationWizardProps> = ({
  onRecommendationGenerated,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Form State initialized with Alphonso Mango defaults
  const [formData, setFormData] = useState<RecommendationInput>({
    foodId: 'mango',
    customFoodName: '',
    moisture: 'High',
    waterActivity: 0.98,
    fatOilPercent: 0.4,
    ph: 4.5,
    respirationRate: 'High',
    ethyleneSensitivity: 'High',
    oxygenSensitivity: 'Medium',
    lightSensitivity: 'Medium',
    desiredShelfLifeDays: 18,
    storageCondition: 'Chilled',
    storageTempC: 13,
    relativeHumidityPercent: 88,
    region: 'West India',
    transportType: 'Reefer Truck',
    transportDurationHours: 36,
    distanceKm: 850,
    vibrationLevel: 'Medium',
    priority: 'map',
  });

  // When user selects a commodity card, prefill biochemical parameters
  const handleSelectFood = (foodId: string) => {
    const food = INDIAN_COMMODITIES.find((c) => c.id === foodId);
    if (!food) return;

    setFormData((prev) => ({
      ...prev,
      foodId: food.id,
      moisture: food.moistureContent,
      waterActivity: food.waterActivity,
      fatOilPercent: food.fatOilContent,
      ph: food.ph,
      respirationRate: food.respirationRate,
      ethyleneSensitivity: food.ethyleneSensitivity,
      oxygenSensitivity: food.oxygenSensitivity,
      lightSensitivity: food.lightSensitivity,
      desiredShelfLifeDays: food.maxShelfLifePackagedDays,
      storageTempC: food.idealTempC,
      relativeHumidityPercent: food.idealRhPercent,
    }));
  };

  // Categories list
  const categories = [
    'All',
    'Fresh Fruits',
    'Vegetables',
    'Grains',
    'Pulses',
    'Spices',
    'Dairy',
    'Processed',
    'Chilled/Frozen',
  ];

  // Filtered commodities
  const filteredCommodities = INDIAN_COMMODITIES.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.hindiName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleStartAnalysis = () => {
    setIsScanning(true);
  };

  const handleScanComplete = () => {
    setIsScanning(false);
    const result = runPackagingRecommendation(formData);
    onRecommendationGenerated(result);
  };

  const selectedFoodObj = INDIAN_COMMODITIES.find((c) => c.id === formData.foodId) || INDIAN_COMMODITIES[0];

  return (
    <section className="py-8 sm:py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Wizard Header */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 mb-2">
          <Cpu className="w-3.5 h-3.5" /> 5-STEP AI RECOMMENDATION WIZARD
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Configure Your <span className="bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text text-transparent">Food & Logistics Parameters</span>
        </h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto mt-2">
          Our heuristic model balances biological respiration rates, moisture sorption isotherms, and Indian cold-chain realities.
        </p>

        {/* Stepper Navigation Bar */}
        <div className="mt-8 flex items-center justify-between max-w-2xl mx-auto relative px-2">
          <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-6 h-0.5 bg-gradient-to-r from-amber-500 to-cyan-500 -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 4) * 85}%` }}
          />

          {[
            { step: 1, label: 'Food' },
            { step: 2, label: 'Properties' },
            { step: 3, label: 'Storage' },
            { step: 4, label: 'Transit' },
            { step: 5, label: 'Priorities' },
          ].map((s) => {
            const isCompleted = currentStep > s.step;
            const isCurrent = currentStep === s.step;
            return (
              <button
                key={s.step}
                onClick={() => setCurrentStep(s.step)}
                className="relative z-10 flex flex-col items-center group cursor-pointer"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                      : isCurrent
                      ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/30 shadow-lg shadow-cyan-500/40'
                      : 'bg-slate-900 text-slate-400 border border-slate-700'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : s.step}
                </div>
                <span
                  className={`text-[11px] font-medium mt-1.5 transition-colors ${
                    isCurrent ? 'text-cyan-300 font-bold' : isCompleted ? 'text-emerald-300' : 'text-slate-500'
                  }`}
                >
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Wizard Form Card */}
      <div className="rounded-3xl glass-card border border-white/15 p-6 sm:p-8 shadow-2xl relative min-h-[480px] flex flex-col justify-between">
        {/* STEP 1: FOOD SELECTION */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-white font-['Outfit']">
                  Step 1: Select Indian Food Commodity
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Choose from verified Indian crops, grains, dairy, and processed foods
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search mango, atta, paneer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs glass-input text-white placeholder-slate-500"
                />
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950 font-semibold'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Commodities Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-1">
              {filteredCommodities.map((food) => {
                const isSelected = formData.foodId === food.id;
                return (
                  <div
                    key={food.id}
                    onClick={() => handleSelectFood(food.id)}
                    className={`p-3 rounded-xl cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900/50 border-white/5 hover:border-white/20 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase">
                        {food.category}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-300" />}
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1">{food.name}</h4>
                    <p className="text-[11px] text-amber-300/80 font-sans">{food.hindiName}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-white/5">
                      <span>Respiration:</span>
                      <span className="font-mono text-slate-200">{food.respirationRate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: FOOD BIOCHEMICAL PROPERTIES */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h3 className="text-xl font-bold text-white font-['Outfit']">
                Step 2: Biochemical & Respiration Profile
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Target properties for <strong className="text-amber-400">{selectedFoodObj.name}</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Moisture Content */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
                <label className="text-xs font-semibold text-slate-300">Moisture Content</label>
                <select
                  value={formData.moisture}
                  onChange={(e) => setFormData({ ...formData, moisture: e.target.value as any })}
                  className="w-full p-2 rounded-xl text-xs glass-input text-white"
                >
                  <option value="Low">Low (&lt; 12%)</option>
                  <option value="Medium">Medium (12% - 40%)</option>
                  <option value="High">High (40% - 85%)</option>
                  <option value="Very High">Very High (&gt; 85%)</option>
                </select>
                <p className="text-[10px] text-slate-500">Affects water vapor barrier requirement (WVTR)</p>
              </div>

              {/* Water Activity (aw) */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Water Activity (a_w)</span>
                  <span className="font-mono text-cyan-300">{formData.waterActivity.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={0.2}
                  max={1.0}
                  step={0.01}
                  value={formData.waterActivity}
                  onChange={(e) => setFormData({ ...formData, waterActivity: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <p className="text-[10px] text-slate-500">&gt; 0.85 = high microbial growth threshold</p>
              </div>

              {/* Fat / Oil % */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Fat / Oil Content</span>
                  <span className="font-mono text-amber-300">{formData.fatOilPercent}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={99}
                  value={formData.fatOilPercent}
                  onChange={(e) => setFormData({ ...formData, fatOilPercent: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <p className="text-[10px] text-slate-500">High fat triggers auto-oxidative rancidity</p>
              </div>

              {/* Respiration Rate */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
                <label className="text-xs font-semibold text-slate-300">Respiration Rate</label>
                <select
                  value={formData.respirationRate}
                  onChange={(e) => setFormData({ ...formData, respirationRate: e.target.value as any })}
                  className="w-full p-2 rounded-xl text-xs glass-input text-white"
                >
                  <option value="None">None (Dry / Processed)</option>
                  <option value="Low">Low (Onion, Potato, Garlic)</option>
                  <option value="Moderate">Moderate (Apple, Orange, Carrot)</option>
                  <option value="High">High (Mango, Tomato, Guava)</option>
                  <option value="Extremely High">Extremely High (Banana, Sweet Corn)</option>
                </select>
                <p className="text-[10px] text-slate-500">Governs micro-perforation and gas venting</p>
              </div>

              {/* Oxygen Sensitivity */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
                <label className="text-xs font-semibold text-slate-300">Oxygen Sensitivity</label>
                <select
                  value={formData.oxygenSensitivity}
                  onChange={(e) => setFormData({ ...formData, oxygenSensitivity: e.target.value as any })}
                  className="w-full p-2 rounded-xl text-xs glass-input text-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical (Paneer, Fish, Desi Ghee)</option>
                </select>
                <p className="text-[10px] text-slate-500">Dictates OTR specification (cc/m²·day)</p>
              </div>

              {/* Desired Shelf Life */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Desired Shelf Life</span>
                  <span className="font-mono text-emerald-300 font-bold">{formData.desiredShelfLifeDays} Days</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={365}
                  value={formData.desiredShelfLifeDays}
                  onChange={(e) => setFormData({ ...formData, desiredShelfLifeDays: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <p className="text-[10px] text-slate-500">Baseline unpackaged: ~{selectedFoodObj.defaultShelfLifeUnpackagedDays} days</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: STORAGE CONDITIONS & CLIMATE */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h3 className="text-xl font-bold text-white font-['Outfit']">
                Step 3: Storage Conditions & Indian Regional Climate
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Packaging performance is heavily influenced by India's diverse temperature and humidity zones
              </p>
            </div>

            {/* Indian Region Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Select Destination Indian Agro-Climatic Zone
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {Object.keys(REGIONS_INFO).map((reg) => {
                  const isSelected = formData.region === reg;
                  const regData = REGIONS_INFO[reg];
                  return (
                    <div
                      key={reg}
                      onClick={() => {
                        setFormData({
                          ...formData,
                          region: reg as IndiaRegion,
                          storageTempC: regData.tempC,
                          relativeHumidityPercent: regData.rhPercent,
                        });
                      }}
                      className={`p-3 rounded-xl cursor-pointer border transition-all ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-500/20'
                          : 'bg-slate-900/50 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{reg}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[11px] font-mono text-cyan-300">
                        <span>{regData.tempC}°C</span>
                        <span>•</span>
                        <span>{regData.rhPercent}% RH</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
              {/* Storage Condition */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
                <label className="text-xs font-semibold text-slate-300">Storage Environment</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['Ambient', 'Chilled', 'Frozen'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setFormData({ ...formData, storageCondition: mode as any })}
                      className={`py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        formData.storageCondition === mode
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Temperature */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Temperature</span>
                  <span className="font-mono text-cyan-300">{formData.storageTempC}°C</span>
                </div>
                <input
                  type="range"
                  min={-18}
                  max={45}
                  value={formData.storageTempC}
                  onChange={(e) => setFormData({ ...formData, storageTempC: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Relative Humidity */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Relative Humidity</span>
                  <span className="font-mono text-amber-300">{formData.relativeHumidityPercent}% RH</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={98}
                  value={formData.relativeHumidityPercent}
                  onChange={(e) => setFormData({ ...formData, relativeHumidityPercent: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: TRANSPORTATION & LOGISTICS */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h3 className="text-xl font-bold text-white font-['Outfit']">
                Step 4: Transit Logistics & Mechanical Stress
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ensures adequate film puncture strength and seal integrity for Indian road/rail freight
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Transport Mode */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-900/60 border border-white/5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-cyan-400" /> Transit Vehicle Type
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['Standard Truck', 'Reefer Truck', 'Rail Cargo', 'Air Freight'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormData({ ...formData, transportType: type as any })}
                      className={`p-2.5 rounded-xl text-xs font-medium text-left transition-all ${
                        formData.transportType === type
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-semibold'
                          : 'bg-slate-800/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transit Distance */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Transit Distance</span>
                  <span className="font-mono text-cyan-300 font-bold">{formData.distanceKm} km</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={2500}
                  step={50}
                  value={formData.distanceKm}
                  onChange={(e) => setFormData({ ...formData, distanceKm: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />

                <div className="flex justify-between text-xs font-semibold pt-2 border-t border-white/5">
                  <span className="text-slate-300">Vibration / Handling Stress</span>
                  <span className="font-mono text-amber-300">{formData.vibrationLevel}</span>
                </div>
                <div className="flex gap-2">
                  {['Low', 'Medium', 'High'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setFormData({ ...formData, vibrationLevel: lvl as any })}
                      className={`flex-1 py-1 rounded-lg text-xs font-medium ${
                        formData.vibrationLevel === lvl
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: PACKAGING PRIORITIES */}
        {currentStep === 5 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h3 className="text-xl font-bold text-white font-['Outfit']">
                Step 5: Define Packaging Strategic Priorities
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Choose the primary optimization focus for the packaging recommendation algorithm
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                {
                  id: 'map',
                  title: 'MAP Produce Optimization',
                  desc: 'Precision $O_2/CO_2$ gas permeability for fresh produce to arrest climacteric ripening',
                  tag: 'Freshness',
                },
                {
                  id: 'max-shelf-life',
                  title: 'Maximum Shelf Life',
                  desc: 'Ultra-high barrier films (EVOH / Foil) to prevent oxidation, aromaloss, and staling',
                  tag: 'Longevity',
                },
                {
                  id: 'low-cost',
                  title: 'Cost Economizer',
                  desc: 'Optimized polymer gauge to minimize unit packaging cost in high-volume Indian markets',
                  tag: 'Budget',
                },
                {
                  id: 'eco-friendly',
                  title: 'Eco-Friendly / Bio-Film',
                  desc: 'Compostable PLA/PBAT or biodegradable kraft structures with lowest carbon footprint',
                  tag: 'Green',
                },
                {
                  id: 'recyclable',
                  title: '100% Recyclable Mono-Material',
                  desc: 'Pure all-PE or all-PP structures compliant with Indian PWM Rules 2022 EPR targets',
                  tag: 'Circular',
                },
                {
                  id: 'premium',
                  title: 'Premium Brand Protection',
                  desc: 'High gloss, anti-fog, puncture-resistant structure with reverse-print barrier',
                  tag: 'Retail',
                },
              ].map((p) => {
                const isSelected = formData.priority === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setFormData({ ...formData, priority: p.id as any })}
                    className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-gradient-to-br from-cyan-950/60 to-slate-900 border-cyan-400 shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-900/50 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-cyan-300">
                        {p.tag}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-cyan-300" />}
                    </div>
                    <h4 className="text-sm font-bold text-white">{p.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation Controls */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              currentStep === 1
                ? 'opacity-40 cursor-not-allowed text-slate-500'
                : 'bg-white/5 hover:bg-white/10 text-white'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <div className="text-xs font-mono text-slate-400">
            Step {currentStep} of 5
          </div>

          {currentStep < 5 ? (
            <button
              onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-1.5 shadow-md shadow-cyan-500/30 transition-all"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleStartAnalysis}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-amber-400 to-cyan-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-amber-500/30 hover:opacity-95 transition-all transform hover:scale-[1.02]"
            >
              <Zap className="w-4 h-4 fill-current" /> Analyze with PackWise AI
            </button>
          )}
        </div>
      </div>

      {/* AI Scanning Modal Trigger */}
      <AiScanModal
        isOpen={isScanning}
        onComplete={handleScanComplete}
        foodName={selectedFoodObj.name}
      />
    </section>
  );
};
