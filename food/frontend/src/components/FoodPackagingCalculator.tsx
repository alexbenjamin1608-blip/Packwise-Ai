import React, { useState, useId } from 'react';
import {
  Calculator,
  TrendingUp,
  Package,
  Sparkles,
  Volume2,
  VolumeX,
  ShieldCheck,
  Truck,
  Leaf,
  ArrowRight,
  RefreshCw,
  Coins,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { SupportedLanguage } from '../i18n/translations';

interface FoodPackagingCalculatorProps {
  currentLanguage?: SupportedLanguage;
  onSpeakText?: (text: string) => void;
  isSpeaking?: boolean;
}

interface CommodityPreset {
  id: string;
  name: string;
  hindi: string;
  emoji: string;
  basePriceKg: number;
  typicalLossPct: number;
  postPackLossPct: number;
  pkgMaterial: string;
  pkgCostPerKg: number;
  shelfLifeGainDays: number;
  defaultQtyKg: number;
}

const COMMODITY_PRESETS: CommodityPreset[] = [
  {
    id: 'tomato',
    name: 'Tomato',
    hindi: 'टमाटर',
    emoji: '🍅',
    basePriceKg: 35,
    typicalLossPct: 30,
    postPackLossPct: 4,
    pkgMaterial: 'एंटी-फॉग व सूक्ष्म-छिद्रित पाउच (Anti-Fog Pouch)',
    pkgCostPerKg: 1.4,
    shelfLifeGainDays: 14,
    defaultQtyKg: 1000,
  },
  {
    id: 'potato',
    name: 'Potato',
    hindi: 'आलू',
    emoji: '🥔',
    basePriceKg: 22,
    typicalLossPct: 20,
    postPackLossPct: 3,
    pkgMaterial: 'हवादार लेनो मेश जालीदार बैग (Leno Mesh Bag)',
    pkgCostPerKg: 0.8,
    shelfLifeGainDays: 60,
    defaultQtyKg: 2000,
  },
  {
    id: 'onion',
    name: 'Onion',
    hindi: 'प्याज',
    emoji: '🧅',
    basePriceKg: 28,
    typicalLossPct: 25,
    postPackLossPct: 4,
    pkgMaterial: 'रेड लेनो मेश बोरी (Leno Mesh Bag)',
    pkgCostPerKg: 0.9,
    shelfLifeGainDays: 50,
    defaultQtyKg: 2000,
  },
  {
    id: 'mango',
    name: 'Alphonso Mango',
    hindi: 'हापुस आम',
    emoji: '🥭',
    basePriceKg: 120,
    typicalLossPct: 35,
    postPackLossPct: 5,
    pkgMaterial: 'फोम जाली + हवादार बॉक्स (Foam Net + Corrugated Box)',
    pkgCostPerKg: 4.5,
    shelfLifeGainDays: 15,
    defaultQtyKg: 500,
  },
  {
    id: 'banana',
    name: 'Banana',
    hindi: 'केला',
    emoji: '🍌',
    basePriceKg: 30,
    typicalLossPct: 32,
    postPackLossPct: 5,
    pkgMaterial: 'एथिलीन सोखने वाला MAP पाउच (Ethylene Absorber)',
    pkgCostPerKg: 1.6,
    shelfLifeGainDays: 16,
    defaultQtyKg: 1000,
  },
  {
    id: 'apple',
    name: 'Apple',
    hindi: 'सेब',
    emoji: '🍎',
    basePriceKg: 110,
    typicalLossPct: 22,
    postPackLossPct: 3,
    pkgMaterial: 'मोल्डेड पल्प ट्रे + छिद्रित एलडीपीई पाउच',
    pkgCostPerKg: 3.2,
    shelfLifeGainDays: 50,
    defaultQtyKg: 800,
  },
  {
    id: 'grapes',
    name: 'Grapes',
    hindi: 'अंगूर',
    emoji: '🍇',
    basePriceKg: 75,
    typicalLossPct: 35,
    postPackLossPct: 6,
    pkgMaterial: 'SO₂ पैड युक्त छिद्रित पाउच + क्रेट्स',
    pkgCostPerKg: 2.8,
    shelfLifeGainDays: 30,
    defaultQtyKg: 600,
  },
  {
    id: 'chilli',
    name: 'Green Chilli',
    hindi: 'हरी मिर्च',
    emoji: '🌶️',
    basePriceKg: 60,
    typicalLossPct: 28,
    postPackLossPct: 4,
    pkgMaterial: 'एंटी-फॉग बीओपीपी पाउच (Anti-Fog BOPP)',
    pkgCostPerKg: 1.8,
    shelfLifeGainDays: 15,
    defaultQtyKg: 400,
  },
  {
    id: 'spinach',
    name: 'Spinach / Greens',
    hindi: 'पालक / हरी पत्तेदार',
    emoji: '🥬',
    basePriceKg: 30,
    typicalLossPct: 45,
    postPackLossPct: 7,
    pkgMaterial: 'हाई-रेस्पिरेशन एंटी-फॉग फिल्म (Anti-Fog Film)',
    pkgCostPerKg: 1.5,
    shelfLifeGainDays: 10,
    defaultQtyKg: 300,
  },
  {
    id: 'paneer',
    name: 'Fresh Paneer',
    hindi: 'ताजा पनीर',
    emoji: '🧀',
    basePriceKg: 320,
    typicalLossPct: 25,
    postPackLossPct: 2,
    pkgMaterial: 'मल्टी-लेयर वैक्यूम पाउच (Multi-Layer Vacuum Pouch)',
    pkgCostPerKg: 6.0,
    shelfLifeGainDays: 18,
    defaultQtyKg: 150,
  },
];

export const FoodPackagingCalculator: React.FC<FoodPackagingCalculatorProps> = ({
  currentLanguage = 'hi',
  onSpeakText,
  isSpeaking = false,
}) => {
  const [selectedCrop, setSelectedCrop] = useState<CommodityPreset>(COMMODITY_PRESETS[0]);
  const [quantityKg, setQuantityKg] = useState<number>(selectedCrop.defaultQtyKg);
  const [pricePerKg, setPricePerKg] = useState<number>(selectedCrop.basePriceKg);
  const [distanceKm, setDistanceKm] = useState<number>(350);
  const [customPkgCost, setCustomPkgCost] = useState<number>(selectedCrop.pkgCostPerKg);
  const [useReeferCold, setUseReeferCold] = useState<boolean>(true);

  // Generate unique IDs for accessibility
  const qtyInputId = useId();
  const priceInputId = useId();
  const distanceInputId = useId();
  const pkgCostInputId = useId();

  // Select crop preset
  const handleCropChange = (crop: CommodityPreset) => {
    setSelectedCrop(crop);
    setQuantityKg(crop.defaultQtyKg);
    setPricePerKg(crop.basePriceKg);
    setCustomPkgCost(crop.pkgCostPerKg);
  };

  // Calculations:
  // 1. Loss without packaging
  const unpkgLossKg = quantityKg * (selectedCrop.typicalLossPct / 100);
  const unpkgLossAmount = unpkgLossKg * pricePerKg;

  // 2. Loss with smart packaging
  // Extra transport distance adds slight loss if distance > 500km and no cold chain
  const distancePenalty = distanceKm > 500 && !useReeferCold ? 2 : 0;
  const effectivePackLossPct = Math.min(selectedCrop.postPackLossPct + distancePenalty, 15);
  const pkgLossKg = quantityKg * (effectivePackLossPct / 100);
  const pkgLossAmount = pkgLossKg * pricePerKg;

  // 3. Saved crop
  const savedKg = unpkgLossKg - pkgLossKg;
  const savedAmount = unpkgLossAmount - pkgLossAmount;

  // 4. Packaging investment
  const totalPkgCost = quantityKg * customPkgCost;

  // 5. Net extra profit
  const netExtraProfit = savedAmount - totalPkgCost;

  // 6. Return on Investment (ROI)
  const roiPct = totalPkgCost > 0 ? Math.round((netExtraProfit / totalPkgCost) * 100) : 0;

  // Read calculation aloud in Hindi
  const handleSpeakCalculation = () => {
    if (!onSpeakText) return;

    const speech = `${selectedCrop.hindi} के ${quantityKg.toLocaleString('en-IN')} किलो पर गणना: बिना सही पैकेजिंग के ₹${Math.round(unpkgLossAmount).toLocaleString('en-IN')} की बर्बादी हो सकती थी। सुझाई गई पैकेजिंग की कुल लागत ₹${Math.round(totalPkgCost).toLocaleString('en-IN')} आएगी। इससे आपकी ₹${Math.round(savedAmount).toLocaleString('en-IN')} की फसल बचेगी, और आपका शुद्ध मुनाफा ₹${Math.round(netExtraProfit).toLocaleString('en-IN')} बढ़ेगा। निवेश पर रिटर्न ${roiPct} प्रतिशत है।`;
    onSpeakText(speech);
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 p-5 sm:p-6 rounded-3xl glass-card-gold border border-amber-500/40 shadow-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-emerald-400 p-[1.5px] shadow-lg shadow-amber-500/25">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Calculator className="w-7 h-7 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-1">
              <Coins className="w-3.5 h-3.5" />
              <span>खाद्य पैकेजिंग बचत व लाभ कैलकुलेटर (Food Packaging Calculator)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
              फसल की बर्बादी रोकें — अपना शुद्ध मुनाफा जानें
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              अपनी फसल का वजन और मंडी का भाव डालें — जानें सही पैकेजिंग से कितने हजार रुपये बचेंगे!
            </p>
          </div>
        </div>

        {/* Speak Aloud Button */}
        <button
          onClick={handleSpeakCalculation}
          className="px-6 py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 text-slate-950 shadow-xl shadow-amber-500/30 hover:opacity-95 transition-all flex items-center gap-2 whitespace-nowrap"
        >
          {isSpeaking ? <VolumeX className="w-5 h-5 animate-pulse" /> : <Volume2 className="w-5 h-5" />}
          <span>{isSpeaking ? 'बोलना बंद करें' : '🔊 हिसाब बोलकर सुनाएं'}</span>
        </button>
      </div>

      {/* Main Grid: Inputs (Left) & Live Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Inputs (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Produce Quick Chips */}
          <div className="p-4 sm:p-5 rounded-3xl glass-card border border-white/10 space-y-3">
            <label className="text-xs font-extrabold text-white uppercase tracking-wider block">
              १. फसल या खाद्य पदार्थ चुनें (Select Food Produce):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {COMMODITY_PRESETS.map((crop) => {
                const isSelected = selectedCrop.id === crop.id;
                return (
                  <button
                    key={crop.id}
                    onClick={() => handleCropChange(crop)}
                    className={`p-2 rounded-xl flex flex-col items-center justify-center text-center transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30 scale-105'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="text-2xl mb-0.5">{crop.emoji}</span>
                    <span className="text-[11px] font-bold leading-tight">{crop.hindi}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sliders and Quantity Form */}
          <div className="p-5 sm:p-6 rounded-3xl glass-card border border-white/10 space-y-5">
            {/* Quantity Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor={qtyInputId} className="font-bold text-white flex items-center gap-1.5 cursor-pointer">
                  <Package className="w-4 h-4 text-amber-400" />
                  <span>फसल की मात्रा (Produce Quantity):</span>
                </label>
                <span className="font-mono text-amber-300 font-extrabold text-sm">
                  {quantityKg.toLocaleString('en-IN')} kg ({(quantityKg / 100).toFixed(1)} क्विंटल)
                </span>
              </div>
              <input
                id={qtyInputId}
                type="range"
                min="100"
                max="20000"
                step="100"
                value={quantityKg}
                onChange={(e) => setQuantityKg(Number(e.target.value))}
                aria-label="फसल की मात्रा (किग्रा)"
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>100 kg</span>
                <span>5,000 kg (50 क्विंटल)</span>
                <span>20,000 kg (200 क्विंटल)</span>
              </div>
            </div>

            {/* Price Per Kg */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor={priceInputId} className="font-bold text-white flex items-center gap-1.5 cursor-pointer">
                  <Coins className="w-4 h-4 text-emerald-400" />
                  <span>मंडी का भाव / विक्रय मूल्य (Price per kg):</span>
                </label>
                <span className="font-mono text-emerald-300 font-extrabold text-sm">
                  ₹{pricePerKg} / kg
                </span>
              </div>
              <input
                id={priceInputId}
                type="range"
                min="10"
                max="500"
                step="5"
                value={pricePerKg}
                onChange={(e) => setPricePerKg(Number(e.target.value))}
                aria-label="मंडी का भाव (रुपये प्रति किग्रा)"
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>₹10/kg</span>
                <span>₹250/kg</span>
                <span>₹500/kg</span>
              </div>
            </div>

            {/* Travel Distance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor={distanceInputId} className="font-bold text-white flex items-center gap-1.5 cursor-pointer">
                  <Truck className="w-4 h-4 text-cyan-400" />
                  <span>मंडी तक की दूरी (Travel Distance):</span>
                </label>
                <span className="font-mono text-cyan-300 font-extrabold text-sm">
                  {distanceKm} km
                </span>
              </div>
              <input
                id={distanceInputId}
                type="range"
                min="20"
                max="1500"
                step="20"
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                aria-label="मंडी तक की दूरी (किमी)"
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Packaging Cost per kg */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor={pkgCostInputId} className="font-bold text-white flex items-center gap-1.5 cursor-pointer">
                  <Leaf className="w-4 h-4 text-amber-400" />
                  <span>पैकेजिंग थैली/सामग्री का खर्च प्रति किलो:</span>
                </label>
                <span className="font-mono text-amber-300 font-extrabold text-sm">
                  ₹{customPkgCost.toFixed(2)} / kg
                </span>
              </div>
              <input
                id={pkgCostInputId}
                type="range"
                min="0.4"
                max="10.0"
                step="0.2"
                value={customPkgCost}
                onChange={(e) => setCustomPkgCost(Number(e.target.value))}
                aria-label="पैकेजिंग खर्च प्रति किग्रा"
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Cold Chain Toggle */}
            <div className="pt-2 flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>❄️ रेफ्रिजरेटेड गाड़ी (Reefer Truck / Cold Van)</span>
                </span>
                <p className="text-[11px] text-slate-400">रास्ते में ठंडक मिलने से ताज़गी दोगुनी रहती है</p>
              </div>
              <button
                onClick={() => setUseReeferCold(!useReeferCold)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  useReeferCold ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    useReeferCold ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Calculated Profits & ROI (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Big Profit Hero Card */}
          <div className="p-6 sm:p-7 rounded-3xl glass-card border border-emerald-500/40 shadow-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{selectedCrop.emoji}</span>
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold block">
                    शुद्ध अतिरिक्त मुनाफा (NET EXTRA PROFIT)
                  </span>
                  <h3 className="text-xl font-black text-white font-['Outfit']">
                    {selectedCrop.hindi} ({selectedCrop.name})
                  </h3>
                </div>
              </div>

              <span className="px-3.5 py-1.5 rounded-xl font-mono text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {roiPct}% ROI
              </span>
            </div>

            {/* Main Money Figure */}
            <div className="text-center py-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                पैकेजिंग अपनाने से कुल शुद्ध बचत / लाभ:
              </span>
              <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-emerald-400 font-['Outfit'] tracking-tight mt-1">
                +₹{Math.round(netExtraProfit).toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-emerald-300/80 mt-1">
                (पैकेजिंग का पूरा खर्च काटकर किसान की जेब में बची अतिरिक्त रकम)
              </p>
            </div>

            {/* 4 Key Comparison Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {/* Metric 1: Spoilage Saved */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[11px] text-slate-400 block">सड़ने से बची फसल:</span>
                <p className="text-lg font-black text-white">
                  {Math.round(savedKg).toLocaleString('en-IN')} kg
                </p>
                <p className="text-[10px] text-emerald-400 font-mono font-bold">
                  मूल्य: ₹{Math.round(savedAmount).toLocaleString('en-IN')}
                </p>
              </div>

              {/* Metric 2: Packaging Cost */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[11px] text-slate-400 block">पैकेजिंग का कुल खर्च:</span>
                <p className="text-lg font-black text-amber-300">
                  ₹{Math.round(totalPkgCost).toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  (₹{customPkgCost.toFixed(2)}/kg हिसाब से)
                </p>
              </div>

              {/* Metric 3: Shelf Life Gain */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[11px] text-slate-400 block">अतिरिक्त ताज़गी:</span>
                <p className="text-lg font-black text-cyan-300">
                  +{selectedCrop.shelfLifeGainDays} दिन
                </p>
                <p className="text-[10px] text-cyan-400 font-mono font-bold">
                  मंडी में देर तक बिकेगी
                </p>
              </div>

              {/* Metric 4: Spoilage Drop */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[11px] text-slate-400 block">बर्बादी में भारी कमी:</span>
                <p className="text-lg font-black text-rose-300">
                  {selectedCrop.typicalLossPct}% ➔ {effectivePackLossPct}%
                </p>
                <p className="text-[10px] text-emerald-400 font-mono font-bold">
                  {selectedCrop.typicalLossPct - effectivePackLossPct}% बर्बादी खत्म!
                </p>
              </div>
            </div>

            {/* Recommended Bag info */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-extrabold text-amber-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>इस फसल के लिए सुझाई गई पैकेजिंग:</span>
              </div>
              <p className="text-sm font-black text-white pl-6">
                {selectedCrop.pkgMaterial}
              </p>
              <p className="text-xs text-slate-300 pl-6 leading-relaxed">
                यह थैली उत्पाद की श्वसन दर (Respiration Rate) और नमी को नियंत्रित करती है, जिससे वजन नहीं घटता और फफूंद नहीं लगती।
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
