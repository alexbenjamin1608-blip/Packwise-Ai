import React, { useState, useEffect } from 'react';
import {
  Wheat,
  AlertCircle,
  Volume2,
  VolumeX,
  Camera,
  CheckCircle2,
  Globe,
  Sparkles,
  ArrowRight,
  Search,
  Thermometer,
  Clock,
  ShieldAlert,
  Package,
} from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../i18n/translations';
import { LiveCropScannerModal } from './LiveCropScannerModal';
import { generateFoodPackagingAdviceAsync } from '../services/aiFoodAdvisor';

interface FarmerSimpleModeProps {
  currentLanguage?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  onSpeakText?: (text: string) => void;
  isSpeaking?: boolean;
  onStopSpeaking?: () => void;
}

interface CropItem {
  id: string;
  hindi: string;
  english: string;
  emoji: string;
  category: string;
  defaultPkg: string;
  defaultTemp: string;
  defaultDays: string;
  defaultWhy: string;
  defaultWarning: string;
}

const VISUAL_CROPS: CropItem[] = [
  {
    id: 'tomato',
    hindi: 'टमाटर',
    english: 'Tomato',
    emoji: '🍅',
    category: 'सब्जी (Vegetable)',
    defaultPkg: 'एंटी-फॉग व सूक्ष्म-छिद्रित पाउच (Anti-Fog Pouch)',
    defaultTemp: '10°C से 13°C (फ्रिज के नीचे वाले डिब्बे में)',
    defaultDays: '14 से 18 दिन (सामान्य से 3 गुना ज्यादा)',
    defaultWhy: 'टमाटर सांस लेता है और पसीना छोड़ता है। एंटी-फॉग थैली में पानी की बूंदें नहीं जमती जिससे टमाटर सड़ता नहीं है।',
    defaultWarning: 'हरे और पके लाल टमाटर को अलग-अलग थैली में रखें। इसे कभी 10°C से नीचे बहुत ठंडा न करें।',
  },
  {
    id: 'potato',
    hindi: 'आलू',
    english: 'Potato',
    emoji: '🥔',
    category: 'सब्जी (Vegetable)',
    defaultPkg: 'हवादार जूट बोरी या जालीदार बैग (Leno Mesh Bag)',
    defaultTemp: 'सूखा और हवादार स्थान (8°C - 10°C)',
    defaultDays: '60 से 90 दिन',
    defaultWhy: 'आलू को खुली सूखी हवा चाहिए। प्लास्टिक की थैली में पसीना आने से आलू सड़ने और अंकुरित होने लगता है।',
    defaultWarning: 'आलू को सीधे तेज रोशनी या धूप में न रखें, वर्ना यह हरा और जहरीला (सोलेनाइन) हो जाएगा।',
  },
  {
    id: 'onion',
    hindi: 'प्याज',
    english: 'Onion',
    emoji: '🧅',
    category: 'सब्जी (Vegetable)',
    defaultPkg: 'लाल जालीदार बोरी (Leno Mesh Bag)',
    defaultTemp: 'सूखा, ठंडा व अंधेरा कमरा',
    defaultDays: '60 से 90 दिन',
    defaultWhy: 'जालीदार बोरी से चारों तरफ से हवा मिलती है और फफूंद नहीं लगती।',
    defaultWarning: 'प्याज को कभी भी प्लास्टिक की बंद थैली में न बांधें और आलू के बिल्कुल पास न रखें।',
  },
  {
    id: 'mango',
    hindi: 'आम',
    english: 'Mango',
    emoji: '🥭',
    category: 'फल (Fruit)',
    defaultPkg: 'हवादार पाउच + फोम जाली (Foam Net + Perforated Pouch)',
    defaultTemp: '12°C से 14°C',
    defaultDays: '15 से 20 दिन',
    defaultWhy: 'फोम जाली से सफर में आम पिचकता या दबता नहीं है और हवादार पाउच फल को प्राकृतिक रूप से सांस लेने देता है।',
    defaultWarning: 'गीले या बारिश में भीगे आम को तुरंत पैक न करें। पहले छाया में सुखा लें।',
  },
  {
    id: 'banana',
    hindi: 'केला',
    english: 'Banana',
    emoji: '🍌',
    category: 'फल (Fruit)',
    defaultPkg: 'एथिलीन सोखने वाला विशेष पाउच (Ethylene Absorber MAP)',
    defaultTemp: '13°C से 15°C (कभी फ्रिज में न रखें)',
    defaultDays: '18 से 25 दिन',
    defaultWhy: 'केला पकते समय एथिलीन गैस छोड़ता है। यह पाउच उस गैस को सोख लेता है ताकि केला जल्दी काला न पड़े।',
    defaultWarning: 'केले को 12°C से नीचे रखने पर उसका छिलका काला पड़ जाता है और स्वाद खराब हो जाता है।',
  },
  {
    id: 'apple',
    hindi: 'सेब',
    english: 'Apple',
    emoji: '🍎',
    category: 'फल (Fruit)',
    defaultPkg: 'छिद्रित एलडीपीई पाउच व मोल्डेड ट्रे (Molded Tray + Pouch)',
    defaultTemp: '0°C से 4°C (कोल्ड स्टोरेज)',
    defaultDays: '60 से 90 दिन',
    defaultWhy: 'ट्रे में सेब एक-दूसरे से टकराते नहीं और दाग-धब्बे नहीं पड़ते।',
    defaultWarning: 'सेब के साथ पत्तेदार सब्जियों को न रखें वर्ना सब्जियां जल्दी पीली पड़ जाएंगी।',
  },
  {
    id: 'grapes',
    hindi: 'अंगूर',
    english: 'Grapes',
    emoji: '🍇',
    category: 'फल (Fruit)',
    defaultPkg: 'सल्फर डाइआक्साइड पैड युक्त छिद्रित पाउच (SO₂ Sheet + Pouch)',
    defaultTemp: '-0.5°C से 1°C (90-95% नमी)',
    defaultDays: '30 से 45 दिन',
    defaultWhy: 'अंगूर में बहुत जल्दी फफूंद (ग्रे मोल्ड) लगती है। SO₂ शीट फफूंद को रोकती है और डंठल हरा रखती है।',
    defaultWarning: 'अंगूर को पैक करने से पहले न धोएं, बेचने या खाने से पहले ही धोएं।',
  },
  {
    id: 'orange',
    hindi: 'संतरा / मौसमी',
    english: 'Orange / Citrus',
    emoji: '🍊',
    category: 'फल (Fruit)',
    defaultPkg: 'वैक्स कोटेड जालीदार बैग (Leno Mesh Bag)',
    defaultTemp: '5°C से 8°C',
    defaultDays: '30 से 40 दिन',
    defaultWhy: 'जालीदार बैग से हवा मिलती है और प्राकृतिक वैक्स छिलके की नमी को उड़ने से रोकता है।',
    defaultWarning: 'सड़े या दाग लगे संतरे को तुरंत हटा दें, नहीं तो पूरे डिब्बे में सड़न फैल जाएगी।',
  },
  {
    id: 'chilli',
    hindi: 'हरी मिर्च',
    english: 'Green Chilli',
    emoji: '🌶️',
    category: 'सब्जी व मसाला',
    defaultPkg: 'सूक्ष्म-छिद्रित एंटी-फॉग पाउच (Micro-Perforated Pouch)',
    defaultTemp: '8°C से 10°C',
    defaultDays: '18 से 24 दिन',
    defaultWhy: 'यह पाउच डंठल को हरा रखता है और मिर्च को सूखने या झुर्रीदार होने से बचाता है।',
    defaultWarning: 'मिर्च के डंठल न तोड़ें। बिना डंठल वाली मिर्च जल्दी सड़ जाती है।',
  },
  {
    id: 'spinach',
    hindi: 'पालक / हरी पत्तेदार',
    english: 'Spinach & Greens',
    emoji: '🥬',
    category: 'पत्तेदार सब्जी',
    defaultPkg: 'एंटी-फॉग बीओपीपी पाउच (Anti-Fog High Respiration Film)',
    defaultTemp: '0°C से 2°C (बर्फ के संपर्क में)',
    defaultDays: '10 से 14 दिन (खुले में सिर्फ 1-2 दिन)',
    defaultWhy: 'पत्ते बहुत तेजी से सूखते हैं। एंटी-फॉग थैली पत्तों को हरा, चमकदार और कुरकुरा रखती है।',
    defaultWarning: 'पैकिंग से पहले पत्तों से पीली पत्तियां और गीला कीचड़ साफ कर लें।',
  },
  {
    id: 'cauliflower',
    hindi: 'फूलगोभी / ब्रोकली',
    english: 'Cauliflower / Broccoli',
    emoji: '🥦',
    category: 'सब्जी (Vegetable)',
    defaultPkg: 'श्रिंक रैप / एंटी-फॉग फिल्म (Shrink Wrap / Anti-Fog Film)',
    defaultTemp: '0°C से 2°C',
    defaultDays: '21 से 28 दिन',
    defaultWhy: 'श्रिंक रैप गोभी के सफेद फूल को पीला होने और बिखरने से पूरी तरह रोकता है।',
    defaultWarning: 'गोभी के चारों तरफ 2-3 हरी पत्तियां छोड़ दें, यह प्राकृतिक सुरक्षा देती हैं।',
  },
  {
    id: 'carrot',
    hindi: 'गाजर',
    english: 'Carrot',
    emoji: '🥕',
    category: 'सब्जी (Vegetable)',
    defaultPkg: 'छिद्रित पॉलीथिन पाउच (Perforated LDPE Bag)',
    defaultTemp: '0°C से 2°C',
    defaultDays: '30 से 50 दिन',
    defaultWhy: 'गाजर की नमी उड़ने से वह नरम पड़ जाती है। यह थैली गाजर को कड़क और मीठी रखती है।',
    defaultWarning: 'ऊपर के हरे पत्ते काटकर पैक करें, पत्ते गाजर की नमी चूस लेते हैं।',
  },
  {
    id: 'paneer',
    hindi: 'ताजा पनीर / खोया',
    english: 'Paneer / Khoya',
    emoji: '🧀',
    category: 'दुग्ध उत्पाद (Dairy)',
    defaultPkg: 'मल्टी-लेयर वैक्यूम पाउच (Multi-Layer Vacuum Pouch)',
    defaultTemp: '2°C से 4°C (चिलर / फ्रीजर)',
    defaultDays: '15 से 25 दिन',
    defaultWhy: 'हवा की ऑक्सीजन से पनीर में खट्टापन और फफूंद आती है। वैक्यूम थैली हवा को शून्य कर देती है।',
    defaultWarning: 'सील करते समय थैली के मुंह पर पानी या चिकनाई न आने दें। सील मजबूत होनी चाहिए।',
  },
  {
    id: 'mushroom',
    hindi: 'मशरूम',
    english: 'Mushroom',
    emoji: '🍄',
    category: 'सब्जी (Vegetable)',
    defaultPkg: 'हवादार पनेट + पीवीसी सांस लेने वाली फिल्म (Punched Punnet)',
    defaultTemp: '2°C से 4°C',
    defaultDays: '7 से 10 दिन',
    defaultWhy: 'मशरूम बहुत ज्यादा सांस लेता है। बंद थैली में यह काला पड़कर पानी छोड़ देता है।',
    defaultWarning: 'मशरूम को कभी भी पानी से धोकर पैक न करें। सिर्फ सूखे ब्रश से साफ करें।',
  },
  {
    id: 'wheat',
    hindi: 'गेहूं / आटा / चावल',
    english: 'Wheat / Flour / Rice',
    emoji: '🌾',
    category: 'अनाज (Grains)',
    defaultPkg: 'लैमिनेटेड एचडीपीई वूवन बोरी या मोनो-पीई पाउच',
    defaultTemp: 'सूखा कमरा (जमीन से ऊपर)',
    defaultDays: '6 से 12 महीने',
    defaultWhy: 'यह बोरी सीलन, बरसात की नमी और घुन-कीड़ों को अंदर जाने से रोकती है।',
    defaultWarning: 'अनाज में नमी 12% से कम होने पर ही पैक करें। फर्श पर लकड़ी का फट्टा बिछाएं।',
  },
  {
    id: 'garlic',
    hindi: 'लहसुन / अदरक',
    english: 'Garlic / Ginger',
    emoji: '🧄',
    category: 'मसाला (Spices)',
    defaultPkg: 'लेनो मेश बैग या जूट बोरी',
    defaultTemp: 'हवादार व सूखा स्थान (12°C - 15°C)',
    defaultDays: '90 से 120 दिन',
    defaultWhy: 'लहसुन और अदरक को खुली हवा चाहिए ताकि उनमें फफूंद न लगे और वजन न घटे।',
    defaultWarning: 'अदरक को गीली मिट्टी के साथ पैक न करें। छाया में सुखाकर पैक करें।',
  },
];

export const FarmerSimpleMode: React.FC<FarmerSimpleModeProps> = ({
  currentLanguage = 'hi',
  onLanguageChange,
  onSpeakText,
  isSpeaking = false,
  onStopSpeaking,
}) => {
  const [internalLang, setInternalLang] = useState<SupportedLanguage>(currentLanguage);
  const [isCameraScannerOpen, setIsCameraScannerOpen] = useState<boolean>(false);
  const [selectedCrop, setSelectedCrop] = useState<CropItem>(VISUAL_CROPS[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customAdvice, setCustomAdvice] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  const activeLang = onLanguageChange ? currentLanguage : internalLang;

  const handleLanguageSelect = (langCode: SupportedLanguage) => {
    setInternalLang(langCode);
    if (onLanguageChange) {
      onLanguageChange(langCode);
    }
  };

  // When a crop is clicked, auto-fetch enriched Gemini advice if applicable
  const handleSelectCrop = async (crop: CropItem) => {
    setSelectedCrop(crop);
    setCustomAdvice(null);

    // Speak aloud in Hindi
    const speech = `${crop.hindi} के लिए सबसे अच्छी पैकेजिंग है: ${crop.defaultPkg}। इसे ${crop.defaultTemp} में रखें। ताज़गी ${crop.defaultDays} तक सुरक्षित रहेगी।`;
    if (onSpeakText) {
      onSpeakText(speech);
    }

    // Try Gemini enriched advice in background
    setIsAiThinking(true);
    try {
      const aiResult = await generateFoodPackagingAdviceAsync(
        `${crop.english} packaging recommendation for Indian farmer`,
        activeLang
      );
      if (aiResult?.replyText) {
        setCustomAdvice(aiResult.replyText);
      }
    } catch (e) {
      console.warn('Gemini advice fallback:', e);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Crop detection callback from Camera / YOLO
  const handleCropDetected = (cropName: string, hindiName: string) => {
    const found = VISUAL_CROPS.find(
      (c) =>
        c.english.toLowerCase().includes(cropName.toLowerCase()) ||
        c.hindi.includes(hindiName) ||
        cropName.toLowerCase().includes(c.id)
    );

    if (found) {
      handleSelectCrop(found);
    } else {
      // Create ad-hoc crop
      const adhoc: CropItem = {
        id: cropName.toLowerCase(),
        hindi: hindiName || cropName,
        english: cropName,
        emoji: '🌿',
        category: 'पहचाना गया उत्पाद',
        defaultPkg: 'सूक्ष्म-छिद्रित एंटी-फॉग पाउच (Micro-Perforated Pouch)',
        defaultTemp: '10°C से 12°C',
        defaultDays: '14 से 21 दिन',
        defaultWhy: 'यह सांस लेने वाली थैली उत्पाद की नमी को संतुलित रखती है।',
        defaultWarning: 'सीधे धूप से बचाएं और हवादार स्थान पर रखें।',
      };
      handleSelectCrop(adhoc);
    }
  };

  // Filter crops based on search query
  const filteredCrops = VISUAL_CROPS.filter(
    (c) =>
      c.hindi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.english.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSpeakAdvice = () => {
    if (!onSpeakText) return;
    const speech = `${selectedCrop.hindi} के लिए सही थैली: ${selectedCrop.defaultPkg}। भंडारण सलाह: ${selectedCrop.defaultTemp}। अनुमानित ताज़गी: ${selectedCrop.defaultDays}। सावधानी: ${selectedCrop.defaultWarning}`;
    onSpeakText(speech);
  };

  return (
    <section className="py-6 sm:py-10 max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* Top Banner with Big Visuals */}
      <div className="mb-6 p-4 rounded-3xl glass-card-gold border border-amber-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-[1.5px] shadow-lg shadow-amber-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl">
              🌾
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-1">
              <span>सरल किसान मोड (Kisan Simple Mode)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
              फसल चुनें — तुरंत बोलकर सुने सही पैकेजिंग
            </h2>
            <p className="text-xs text-slate-300">
              बिना किसी परेशानी के अपनी फसल पर उंगली छुएं और सही थैली, तापमान व शेल्फ-लाइफ जानें।
            </p>
          </div>
        </div>

        {/* Big Action Buttons for Uneducated Users */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => setIsCameraScannerOpen(true)}
            className="flex-1 md:flex-initial px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 shadow-xl shadow-emerald-500/30 hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            <Camera className="w-5 h-5" />
            <span>📸 कैमरा से फसल स्कैन करें (YOLO)</span>
          </button>

          <button
            onClick={handleSpeakAdvice}
            className="flex-1 md:flex-initial px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-xl shadow-amber-500/30 hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            {isSpeaking ? <VolumeX className="w-5 h-5 animate-pulse" /> : <Volume2 className="w-5 h-5" />}
            <span>{isSpeaking ? 'बोलना बंद करें' : '🔊 बोलकर सुनाएं (Listen)'}</span>
          </button>
        </div>
      </div>

      {/* Language Switcher Quick Chips */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
          <Globe className="w-4 h-4 text-amber-400" />
          <span>अपनी भाषा चुनें:</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                activeLang === lang.code
                  ? 'bg-gradient-to-r from-amber-500 to-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'bg-white/5 text-slate-300 hover:text-white'
              }`}
            >
              {lang.nativeName}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Visual Crop Grid (Left) + Detailed Advice Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Crop Selector Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <span>१. अपनी फसल चुनें (Select Your Produce)</span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                {VISUAL_CROPS.length} मुख्य फसलें
              </span>
            </h3>

            {/* Quick Search */}
            <div className="relative w-44">
              <input
                type="text"
                placeholder="फसल खोजें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-2 py-1 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {filteredCrops.map((crop) => {
              const isSelected = selectedCrop.id === crop.id;
              return (
                <button
                  key={crop.id}
                  onClick={() => handleSelectCrop(crop)}
                  className={`relative p-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-b from-amber-500/30 to-amber-950/60 border-2 border-amber-400 shadow-xl shadow-amber-500/25 scale-[1.03]'
                      : 'bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <span className="text-3xl sm:text-4xl mb-1.5 filter drop-shadow-md">{crop.emoji}</span>
                  <span className="text-xs sm:text-sm font-black text-white">{crop.hindi}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{crop.english}</span>

                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Prominent Advice Box with Large Icons & Easy Explanation (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl glass-card border border-amber-500/50 shadow-2xl bg-slate-950/90 space-y-4">
            {/* Header with Crop Title & Audio */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-4xl filter drop-shadow">{selectedCrop.emoji}</span>
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                    पैकेजिंग सलाह (Packaging Advice)
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
                    {selectedCrop.hindi} ({selectedCrop.english})
                  </h3>
                </div>
              </div>

              <button
                onClick={handleSpeakAdvice}
                className="p-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-transform active:scale-95 shadow"
                title="बोलकर सुनें"
              >
                {isSpeaking ? <VolumeX className="w-5 h-5 text-amber-400 animate-pulse" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
              </button>
            </div>

            {/* Visual Advice Cards */}
            <div className="space-y-3">
              {/* 1. Recommended Bag */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-1">
                <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400">
                  <Package className="w-4 h-4" />
                  <span>सही थैली / बैग (Recommended Package):</span>
                </div>
                <p className="text-sm sm:text-base font-black text-white pl-6">
                  {selectedCrop.defaultPkg}
                </p>
                <p className="text-xs text-slate-300 pl-6 leading-relaxed pt-1">
                  {selectedCrop.defaultWhy}
                </p>
              </div>

              {/* 2. Ideal Storage Temperature */}
              <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 space-y-1">
                <div className="flex items-center gap-2 text-xs font-extrabold text-cyan-400">
                  <Thermometer className="w-4 h-4" />
                  <span>सही तापमान (Storage Temperature):</span>
                </div>
                <p className="text-sm sm:text-base font-black text-cyan-200 pl-6">
                  {selectedCrop.defaultTemp}
                </p>
              </div>

              {/* 3. Freshness / Shelf Life Days */}
              <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-1">
                <div className="flex items-center gap-2 text-xs font-extrabold text-amber-400">
                  <Clock className="w-4 h-4" />
                  <span>ताज़गी के दिन (Shelf Life):</span>
                </div>
                <p className="text-sm sm:text-base font-black text-amber-200 pl-6">
                  {selectedCrop.defaultDays}
                </p>
              </div>

              {/* 4. Important Warning for Farmers */}
              <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-1">
                <div className="flex items-center gap-2 text-xs font-extrabold text-rose-400">
                  <ShieldAlert className="w-4 h-4" />
                  <span>जरूरी सावधानी (Warning / Tip):</span>
                </div>
                <p className="text-xs sm:text-sm text-rose-200 pl-6 leading-relaxed">
                  {selectedCrop.defaultWarning}
                </p>
              </div>
            </div>

            {/* Gemini Live Scientific Enrichment */}
            {isAiThinking && (
              <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/40 flex items-center gap-2.5 text-xs text-purple-300">
                <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
                <span>Gemini 3.6 AI विस्तृत वैज्ञानिक आंकड़े तैयार कर रहा है...</span>
              </div>
            )}

            {customAdvice && !isAiThinking && (
              <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/40 space-y-1">
                <span className="text-[10px] font-mono text-purple-300 font-bold uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" /> GEMINI 3.6 AI वैज्ञानिक विवरण:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {customAdvice}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Crop / Food Scanner Modal with YOLO */}
      <LiveCropScannerModal
        isOpen={isCameraScannerOpen}
        onClose={() => setIsCameraScannerOpen(false)}
        onCropDetected={handleCropDetected}
        currentLanguage={activeLang}
      />
    </section>
  );
};
