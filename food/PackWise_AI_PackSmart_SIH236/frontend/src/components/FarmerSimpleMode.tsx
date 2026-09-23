import React, { useState } from 'react';
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
} from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../i18n/translations';
import { LiveCropScannerModal } from './LiveCropScannerModal';

interface FarmerSimpleModeProps {
  currentLanguage?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  onSpeakText?: (text: string) => void;
  isSpeaking?: boolean;
  onStopSpeaking?: () => void;
}

interface SimpleAnswerState {
  crop: string;
  shelfLifeDays: string;
  storagePlace: string;
  travelDistance: string;
  coldChain: string;
  preference: string;
}

interface LocalizedFarmerText {
  title: string;
  subTitle: string;
  badge: string;
  scanButton: string;
  speakButton: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
  resultTitle: string;
  whyTitle: string;
  storageTitle: string;
  shelfLifeTitle: string;
  warningTitle: string;
}

const FARMER_LOCALIZATION: Record<SupportedLanguage, LocalizedFarmerText> = {
  hi: {
    title: 'आसान मोड — सरल भाषा में पैकेजिंग सलाह',
    subTitle: 'बिना किसी तकनीकी झंझट के अपनी फसल या खाद्य पदार्थ के लिए सही थैली, तापमान और रखरखाव चुनें।',
    badge: 'किसान व छोटे व्यापारियों के लिए सरल मोड',
    scanButton: 'कैमरा से फसल स्कैन करें',
    speakButton: 'सलाह बोलकर सुनाएं',
    q1: '१. आप क्या पैक कर रहे हैं?',
    q2: '२. कितने दिन सुरक्षित रखना है?',
    q3: '३. माल कहाँ रखेंगे?',
    q4: '४. कितनी दूर भेजना है?',
    q5: '५. क्या रास्ते में ठंडक (Reefer) मिलेगी?',
    q6: '६. प्राथमिकता क्या है?',
    resultTitle: 'किसान पैकेजिंग सलाह परिणाम',
    whyTitle: 'यह थैली क्यों चुनें (Why?):',
    storageTitle: 'भंडारण व रखरखाव (Storage Advice):',
    shelfLifeTitle: 'अनुमानित ताज़गी (Shelf-Life Estimate):',
    warningTitle: 'महत्वपूर्ण सावधानी (Important Note):',
  },
  mr: {
    title: 'सोपा मोड — सोप्या भाषेत पॅकेजिंग सल्ला',
    subTitle: 'कोणत्याही तांत्रिक अडचणीशिवाय आपल्या शेतमालासाठी योग्य पिशवी, तापमान आणि साठवणूक निवडा.',
    badge: 'शेतकरी आणि छोट्या व्यावसायिकांसाठी सोपा मोड',
    scanButton: 'कॅमेऱ्याने पीक स्कॅन करा',
    speakButton: 'सल्ला ऐका',
    q1: '१. तुम्ही काय पॅक करत आहात?',
    q2: '२. किती दिवस ताजे ठेवायचे आहे?',
    q3: '३. माल कुठे ठेवणार आहात?',
    q4: '४. किती दूर पाठवायचे आहे?',
    q5: '५. प्रवासात थंडावा (Reefer) मिळेल का?',
    q6: '६. प्राथमिकता काय आहे?',
    resultTitle: 'शेतकरी पॅकेजिंग सल्ला निकाल',
    whyTitle: 'ही पिशवी का निवडावी:',
    storageTitle: 'साठवणूक सल्ला:',
    shelfLifeTitle: 'अंदाजे ताजेपणा:',
    warningTitle: 'महत्त्वाची काळजी:',
  },
  gu: {
    title: 'સરળ મોડ — સાદી ભાષામાં પેકેજિંગ સલાહ',
    subTitle: 'કોઈપણ ટેકનિકલ ઝંઝટ વગર તમારા પાક માટે યોગ્ય થેલી, તાપમાન અને સંગ્રહ પસંદ કરો.',
    badge: 'ખેડૂતો અને નાના વેપારીઓ માટે સરળ મોડ',
    scanButton: 'કેમેરાથી પાક સ્કેન કરો',
    speakButton: 'સલાહ સાંભળો',
    q1: '૧. તમે શું પેક કરી રહ્યા છો?',
    q2: '૨. કેટલા દિવસ સુરક્ષિત રાખવું છે?',
    q3: '૩. માલ ક્યાં રાખશો?',
    q4: '૪. કેટલી દૂર મોકલવો છે?',
    q5: '૫. રસ્તામાં ઠંડક (Reefer) મળશે?',
    q6: '૬. પ્રાથમિકતા શું છે?',
    resultTitle: 'ખેડૂત પેકેજિંગ સલાહ પરિણામ',
    whyTitle: 'આ થેલી કેમ પસંદ કરવી:',
    storageTitle: 'સંગ્રહ સલાહ:',
    shelfLifeTitle: 'અંદાજિત તાજગી:',
    warningTitle: 'મહત્વપૂર્ણ સાવચેતી:',
  },
  pa: {
    title: 'ਸਰਲ ਮੋਡ — ਸੌਖੀ ਬੋਲੀ ਵਿੱਚ ਪੈਕੇਜਿੰਗ ਸਲਾਹ',
    subTitle: 'ਬਿਨਾਂ ਕਿਸੇ ਤਕਨੀਕੀ ਝੰਜਟ ਦੇ ਆਪਣੀ ਫਸਲ ਲਈ ਸਹੀ ਥੈਲਾ, ਤਾਪਮਾਨ ਅਤੇ ਸਟੋਰੇਜ ਚੁਣੋ।',
    badge: 'ਕਿਸਾਨਾਂ ਅਤੇ ਛੋਟੇ ਵਪਾਰੀਆਂ ਲਈ ਸਰਲ ਮੋਡ',
    scanButton: 'ਕੈਮਰੇ ਨਾਲ ਫਸਲ ਸਕੈਨ ਕਰੋ',
    speakButton: 'ਸਲਾਹ ਸੁਣੋ',
    q1: '੧. ਤੁਸੀਂ ਕੀ ਪੈਕ ਕਰ ਰਹੇ ਹੋ?',
    q2: '੨. ਕਿੰਨੇ ਦਿਨ ਸੁਰੱਖਿਅਤ ਰੱਖਣਾ ਹੈ?',
    q3: '੩. ਮਾਲ ਕਿੱਥੇ ਰੱਖਣਾ ਹੈ?',
    q4: '੪. ਕਿੰਨੀ ਦੂਰ ਭੇਜਣਾ ਹੈ?',
    q5: '੫. ਕੀ ਰਸਤੇ ਵਿੱਚ ਠੰਡਕ ਮਿਲੇਗੀ?',
    q6: '੬. ਤਰਜੀਹ ਕੀ ਹੈ?',
    resultTitle: 'ਕਿਸਾਨ ਪੈਕੇਜਿੰਗ ਸਲਾਹ ਨਤੀਜਾ',
    whyTitle: 'ਇਹ ਥੈਲਾ ਕਿਉਂ ਚੁਣੋ:',
    storageTitle: 'ਸਟੋਰੇਜ ਸਲਾਹ:',
    shelfLifeTitle: 'ਅੰਦਾਜਨ ਤਾਜ਼ਗੀ:',
    warningTitle: 'ਜਰੂਰੀ ਸਾਵਧਾਨੀ:',
  },
  ta: {
    title: 'எளிய முறை — எளிய மொழியில் பேக்கேஜிங் ஆலோசனை',
    subTitle: 'தொழில்நுட்ப சிக்கல்கள் இல்லாமல் உங்கள் விளைபொருளுக்கான சரியான பை, வெப்பநிலை மற்றும் சேமிப்பைத் தேர்வுசெய்க.',
    badge: 'விவசாயிகள் மற்றும் சிறு வணிகர்களுக்கான எளிய முறை',
    scanButton: 'கேமரா மூலம் ஸ்கேன் செய்',
    speakButton: 'ஆலோசனையைக் கேட்கவும்',
    q1: '1. நீங்கள் எதை பேக் செய்கிறீர்கள்?',
    q2: '2. எத்தனை நாட்கள் பாதுகாப்பாக இருக்க வேண்டும்?',
    q3: '3. எங்கு சேமித்து வைப்பீர்கள்?',
    q4: '4. எவ்வளவு தூரம் அனுப்ப வேண்டும்?',
    q5: '5. வழியில் குளிர் வசதி கிடைக்குமா?',
    q6: '6. உங்கள் முன்னுரிமை என்ன?',
    resultTitle: 'விவசாயி பேக்கேஜிங் ஆலோசனை முடிவு',
    whyTitle: 'இந்த பேக்கேஜிங்கை ஏன் தேர்வு செய்ய வேண்டும்:',
    storageTitle: 'சேமிப்பு ஆலோசனை:',
    shelfLifeTitle: 'எதிர்பார்க்கப்படும் புத்துணர்ச்சி:',
    warningTitle: 'முக்கிய எச்சரிக்கை:',
  },
  te: {
    title: 'సులభ మోడ్ — సరళమైన భాషలో ప్యాకేజింగ్ సలహా',
    subTitle: 'ఎలాంటి సాంకేతిక ఇబ్బందులు లేకుండా మీ పంటకు సరైన సంచి, ఉష్ణోగ్రత మరియు నిల్వను ఎంచుకోండి.',
    badge: 'రైతులు మరియు చిన్న వ్యాపారుల కోసం సులభ మోడ్',
    scanButton: 'కెమెరాతో పంటను స్కాన్ చేయండి',
    speakButton: 'సలహాను వినండి',
    q1: '1. మీరు ఏమి ప్యాక్ చేస్తున్నారు?',
    q2: '2. ఎన్ని రోజులు తాజాగా ఉండాలి?',
    q3: '3. సరుకు ఎక్కడ నిల్వ చేస్తారు?',
    q4: '4. ఎంత దూరం పంపించాలి?',
    q5: '5. మార్గంలో చల్లదనం (రీఫర్) లభిస్తుందా?',
    q6: '6. ప్రాధాన్యత ఏమిటి?',
    resultTitle: 'రైతు ప్యాకేజింగ్ సలహా ఫలితం',
    whyTitle: 'ఈ ప్యాకేజీని ఎందుకు ఎంచుకోవాలి:',
    storageTitle: 'నిల్వ సలహా:',
    shelfLifeTitle: 'అంచనా తాజాదనం:',
    warningTitle: 'ముఖ్యమైన గమనిక:',
  },
  bn: {
    title: 'সহজ মোড — সহজ ভাষায় প্যাকেজিং পরামর্শ',
    subTitle: 'কোনো জটিলতা ছাড়া আপনার ফসলের জন্য সঠিক থলি, তাপমাত্রা এবং সংরক্ষণ ব্যবস্থা বেছে নিন।',
    badge: 'কৃষক ও ক্ষুদ্র ব্যবসায়ীদের জন্য সহজ মোড',
    scanButton: 'ক্যামেরা দিয়ে ফসল স্ক্যান করুন',
    speakButton: 'পরামর্শ শুনুন',
    q1: '১. আপনি কী প্যাক করছেন?',
    q2: '২. কত দিন তাজা রাখতে হবে?',
    q3: '৩. কোথায় সংরক্ষণ করবেন?',
    q4: '৪. কত দূরে পাঠাবেন?',
    q5: '৫. পরিবহনে শীতল পরিবেশ (Reefer) থাকবে?',
    q6: '৬. অগ্রাধিকার কী?',
    resultTitle: 'কৃষক প্যাকেজিং পরামর্শ ফলাফল',
    whyTitle: 'এই থলিটি কেন বেছে নেবেন:',
    storageTitle: 'সংরক্ষণ পরামর্শ:',
    shelfLifeTitle: 'আনুমানিক সতেজতা:',
    warningTitle: 'গুরুত্বপূর্ণ সতর্কতা:',
  },
  en: {
    title: 'Aasaan Mode — Simple Food Packaging Advice',
    subTitle: 'Choose the right pouch, storage conditions, and shelf life for your produce in plain language.',
    badge: 'Farmer & MSME Simple Mode',
    scanButton: 'Scan Crop with Camera',
    speakButton: 'Read Advice Aloud',
    q1: '1. What are you packing?',
    q2: '2. How many days should it last?',
    q3: '3. Where will you store it?',
    q4: '4. How far will it travel?',
    q5: '5. Will it stay cold in transit (Reefer)?',
    q6: '6. What is your priority?',
    resultTitle: 'Farmer Packaging Advice Result',
    whyTitle: 'Why choose this package:',
    storageTitle: 'Storage Advice:',
    shelfLifeTitle: 'Shelf-Life Estimate:',
    warningTitle: 'Important Note:',
  },
};

export const FarmerSimpleMode: React.FC<FarmerSimpleModeProps> = ({
  currentLanguage = 'hi',
  onLanguageChange,
  onSpeakText,
  isSpeaking = false,
  onStopSpeaking,
}) => {
  const [internalLang, setInternalLang] = useState<SupportedLanguage>(currentLanguage);
  const [isCameraScannerOpen, setIsCameraScannerOpen] = useState<boolean>(false);

  const [answers, setAnswers] = useState<SimpleAnswerState>({
    crop: 'आम (Mango)',
    shelfLifeDays: '10-18 Days',
    storagePlace: 'Cold Storage',
    travelDistance: 'Highway Mandi > 500 km',
    coldChain: 'Yes, Reefer Truck',
    preference: 'Affordable & Safe',
  });

  const activeLang = onLanguageChange ? currentLanguage : internalLang;
  const t = FARMER_LOCALIZATION[activeLang] || FARMER_LOCALIZATION.hi;

  const handleLanguageSelect = (langCode: SupportedLanguage) => {
    setInternalLang(langCode);
    if (onLanguageChange) {
      onLanguageChange(langCode);
    }
  };

  // Crop detection callback from Camera
  const handleCropDetected = (cropName: string, hindiName: string) => {
    setAnswers((prev) => ({
      ...prev,
      crop: `${hindiName} (${cropName})`,
    }));
  };

  // Advice logic
  const getSimpleAdvice = () => {
    if (answers.crop.includes('Mango') || answers.crop.includes('आम')) {
      return {
        pkgName: 'छिद्र वाली सांस लेने वाली पॉलीथिन थैली (Micro-Perforated Pouch)',
        why: 'आम सांस लेता है। अगर इसे पूरी तरह हवा बंद थैली में रखेंगे तो फल अंदर ही पककर खराब हो जाएगा। यह विशेष थैली सही मात्रा में हवा अंदर जाने देती है।',
        storageTip: 'थैली को 12°C से 14°C तापमान में रखें। फल को सीधे धूप और अत्यधिक गर्मी से बचाएं।',
        shelfLife: '15 से 18 दिन तक ताज़ा रहेगा (बिना थैली के सिर्फ 4-5 दिन रहता है)।',
        warningNote: 'गीले या भीगे हुए आम को पैक न करें। पहले छाया में सुखा लें ताकि फफूंद न लगे।',
      };
    } else if (answers.crop.includes('आलू') || answers.crop.includes('प्याज') || answers.crop.includes('Potato') || answers.crop.includes('Onion')) {
      return {
        pkgName: 'हवादार जालीदार बोरी (Leno Mesh Bag) या जूट बोरी',
        why: 'आलू और प्याज को खुली सूखी हवा चाहिए। प्लास्टिक की बंद थैली में पसीना जमने से सड़न और अंकुरण शुरू हो जाता है।',
        storageTip: 'अंधेरे और सूखे चबूतरे पर रखें। रोशनी से आलू हरा होने लगता है।',
        shelfLife: '45 से 60 दिन तक सुरक्षित रहेगा।',
        warningNote: 'आलू को सीधे जमीन की नमी से दूर लकड़ी के फट्टे (pallet) पर रखें।',
      };
    } else if (answers.crop.includes('दूध') || answers.crop.includes('पनीर') || answers.crop.includes('Paneer')) {
      return {
        pkgName: 'मल्टी-लेयर सीलबंद थैली (Multi-Layer Vacuum Pouch)',
        why: 'पनीर में फफूंद और खटास हवा की ऑक्सीजन से आती है। यह थैली हवा को पूरी तरह रोकती है ताकि पनीर सख्त न हो और खट्टा न पड़े।',
        storageTip: 'हर हाल में 4°C से कम ठंडे फ्रीजर/चिलर में रखें। रास्ते में बर्फ इस्तेमाल करें।',
        shelfLife: '12 से 20 दिन तक ताज़ा रहेगा।',
        warningNote: 'सील टूटने पर तुरंत इस्तेमाल करें। सील में तेल या पानी न आने दें।',
      };
    } else {
      return {
        pkgName: 'मजबूत प्लास्टिक लेमिनेट पाउच (Mono-PE या BOPP/PE Pouch)',
        why: 'यह अनाज, दाल या मसाले को बरसात की नमी और कीड़ों (weevils) से पूरी तरह बचाता है।',
        storageTip: 'सूखी जगह पर जमीन से 6 इंच ऊपर रखें।',
        shelfLife: '6 महीने से 1 साल तक सुरक्षित रहेगा।',
        warningNote: 'पैक करने से पहले अनाज में नमी 12% से कम होनी चाहिए।',
      };
    }
  };

  const advice = getSimpleAdvice();

  const handleSpeakAdvice = () => {
    if (!onSpeakText) return;
    const speech = `${advice.pkgName}। ${t.whyTitle} ${advice.why} ${t.storageTitle} ${advice.storageTip} ${t.shelfLifeTitle} ${advice.shelfLife} ${t.warningTitle} ${advice.warningNote}`;
    onSpeakText(speech);
  };

  return (
    <section className="py-8 sm:py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Prominent In-Place Language Switcher Bar */}
      <div className="mb-6 p-3 rounded-2xl glass-card border border-amber-500/30 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
          <Globe className="w-4 h-4 text-amber-400" />
          <span>भाषा चुनें / Select Farmer Language:</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                activeLang === lang.code
                  ? 'bg-gradient-to-r from-amber-500 to-cyan-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {lang.nativeName}
            </button>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 mb-2 animate-float-slow shadow-lg shadow-amber-500/10">
          <Wheat className="w-4 h-4 text-amber-400" /> {t.badge}
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          {t.title}
        </h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto mt-2">
          {t.subTitle}
        </p>

        {/* Live Camera Scan Button */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={() => setIsCameraScannerOpen(true)}
            className="relative px-6 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-400 text-slate-950 shadow-xl shadow-cyan-500/30 flex items-center gap-2.5 hover:opacity-95 transition-all transform hover:scale-105 animate-pulse-ring"
          >
            <Camera className="w-4 h-4 text-slate-950" />
            <span className="font-extrabold tracking-wide">{t.scanButton}</span>
            <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
          </button>
        </div>
      </div>

      {/* 6 Questions Form */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/15 shadow-2xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Q1 */}
          <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
            <label className="font-bold text-white text-sm">{t.q1}</label>
            <select
              value={answers.crop}
              onChange={(e) => setAnswers({ ...answers, crop: e.target.value })}
              className="w-full p-2.5 rounded-xl glass-input text-white text-xs mt-1"
            >
              <option value="आम (Mango)">आम (Mango)</option>
              <option value="टमाटर (Tomato)">टमाटर (Tomato)</option>
              <option value="आलू या प्याज (Potato / Onion)">आलू या प्याज (Potato / Onion)</option>
              <option value="चावल या दाल (Rice / Pulses)">चावल या दाल (Rice / Pulses)</option>
              <option value="हल्दी या मसाले (Spices)">हल्दी या मसाले (Spices)</option>
              <option value="पनीर या खोया (Paneer / Dairy)">पनीर या खोया (Paneer / Dairy)</option>
              <option value="नमकीन या बिस्कुट (Namkeen)">नमकीन या बिस्कुट (Namkeen)</option>
            </select>
          </div>

          {/* Q2 */}
          <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
            <label className="font-bold text-white text-sm">{t.q2}</label>
            <select
              value={answers.shelfLifeDays}
              onChange={(e) => setAnswers({ ...answers, shelfLifeDays: e.target.value })}
              className="w-full p-2.5 rounded-xl glass-input text-white text-xs mt-1"
            >
              <option value="4-7 Days">४ से ७ दिन (स्थानीय मंडी / 4-7 Days)</option>
              <option value="10-18 Days">१० से १८ दिन (२ हफ्ते / 10-18 Days)</option>
              <option value="1 Month">१ महीना (1 Month)</option>
              <option value="6-12 Months">६ से १२ महीने (लंबा भंडारण / 6-12 Months)</option>
            </select>
          </div>

          {/* Q3 */}
          <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
            <label className="font-bold text-white text-sm">{t.q3}</label>
            <select
              value={answers.storagePlace}
              onChange={(e) => setAnswers({ ...answers, storagePlace: e.target.value })}
              className="w-full p-2.5 rounded-xl glass-input text-white text-xs mt-1"
            >
              <option value="Normal Room">साधारण कमरा / खुला शेड (Normal Room)</option>
              <option value="Cold Storage">कोल्ड स्टोरेज (Cold Storage)</option>
            </select>
          </div>

          {/* Q4 */}
          <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
            <label className="font-bold text-white text-sm">{t.q4}</label>
            <select
              value={answers.travelDistance}
              onChange={(e) => setAnswers({ ...answers, travelDistance: e.target.value })}
              className="w-full p-2.5 rounded-xl glass-input text-white text-xs mt-1"
            >
              <option value="Local Mandi < 100 km">पास की स्थानीय मंडी (&lt; 100 km)</option>
              <option value="Highway Mandi > 500 km">दूर अंतर्राज्यीय मंडी (&gt; 500 km)</option>
              <option value="Export Cargo">विदेश एक्सपोर्ट (Export Air/Sea)</option>
            </select>
          </div>

          {/* Q5 */}
          <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
            <label className="font-bold text-white text-sm">{t.q5}</label>
            <select
              value={answers.coldChain}
              onChange={(e) => setAnswers({ ...answers, coldChain: e.target.value })}
              className="w-full p-2.5 rounded-xl glass-input text-white text-xs mt-1"
            >
              <option value="No, Open Tempo">नहीं, साधारण खुली गाड़ी (Open tempo/truck)</option>
              <option value="Yes, Reefer Truck">हां, ठंडी गाड़ी में (Reefer cold truck)</option>
            </select>
          </div>

          {/* Q6 */}
          <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
            <label className="font-bold text-white text-sm">{t.q6}</label>
            <select
              value={answers.preference}
              onChange={(e) => setAnswers({ ...answers, preference: e.target.value })}
              className="w-full p-2.5 rounded-xl glass-input text-white text-xs mt-1"
            >
              <option value="Affordable & Safe">कम खर्च में टिकाऊ (Low Cost)</option>
              <option value="Max Freshness">अधिकतम ताज़गी (Max Freshness)</option>
              <option value="Eco-friendly">पर्यावरण के अनुकूल (Eco-friendly)</option>
            </select>
          </div>
        </div>

        {/* Localized Advice Card */}
        <div className="p-6 rounded-3xl glass-card-gold border border-amber-500/40 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
            <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
              {t.resultTitle}
            </span>

            {/* Read Aloud Audio Button */}
            {onSpeakText && (
              <button
                onClick={isSpeaking ? onStopSpeaking : handleSpeakAdvice}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  isSpeaking
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 animate-pulse-ring'
                    : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40'
                }`}
              >
                {isSpeaking ? (
                  <div className="flex items-center gap-0.5 h-3">
                    <span className="w-0.5 bg-white rounded-full animate-sound-bar-1" />
                    <span className="w-0.5 bg-white rounded-full animate-sound-bar-2" />
                    <span className="w-0.5 bg-white rounded-full animate-sound-bar-3" />
                    <span className="w-0.5 bg-white rounded-full animate-sound-bar-4" />
                  </div>
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>{isSpeaking ? 'रुकें / Stop' : t.speakButton}</span>
              </button>
            )}
          </div>

          <div>
            <span className="text-xs text-amber-400 font-semibold">सुझाई गई थैली / सामग्री:</span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5 font-['Outfit']">
              {advice.pkgName}
            </h3>
          </div>

          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
              <strong className="text-amber-300 block mb-0.5">{t.whyTitle}</strong>
              <p className="text-slate-200 leading-relaxed">{advice.why}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
              <strong className="text-cyan-300 block mb-0.5">{t.storageTitle}</strong>
              <p className="text-slate-200 leading-relaxed">{advice.storageTip}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
              <strong className="text-emerald-300 block mb-0.5">{t.shelfLifeTitle}</strong>
              <p className="text-emerald-200 font-bold">{advice.shelfLife}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-relaxed flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>{t.warningTitle}</strong> {advice.warningNote}
            </span>
          </div>
        </div>
      </div>

      {/* Live Crop Scanner Modal */}
      <LiveCropScannerModal
        isOpen={isCameraScannerOpen}
        onClose={() => setIsCameraScannerOpen(false)}
        onCropDetected={handleCropDetected}
        currentLanguage={activeLang}
      />
    </section>
  );
};
