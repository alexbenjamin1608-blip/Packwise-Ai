export type SupportedLanguage =
  | 'en'
  | 'hi'
  | 'mr'
  | 'ta'
  | 'te'
  | 'gu'
  | 'bn'
  | 'pa';

export interface LanguageMeta {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  speechLocale: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en', name: 'English', nativeName: 'English', speechLocale: 'en-IN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', speechLocale: 'hi-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', speechLocale: 'mr-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', speechLocale: 'ta-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', speechLocale: 'te-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', speechLocale: 'gu-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', speechLocale: 'bn-IN' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', speechLocale: 'pa-IN' },
];

export interface TranslationDictionary {
  tagline: string;
  subTagline: string;
  home: string;
  visualStory: string;
  aiRecommend: string;
  lab3d: string;
  materials: string;
  shelfLife: string;
  map: string;
  compliance: string;
  cost: string;
  sustainability: string;
  coldChain: string;
  roiCalc: string;
  farmerMode: string;
  dashboard: string;
  startAiRecommendation: string;
  explore3dLab: string;
  voiceAssistant: string;
  speakAdvice: string;
  listening: string;
  tapToSpeak: string;
  voiceWelcome: string;
  whyThisPackageTitle: string;
  recommendedStructure: string;
  compatibility: string;
  daysShelfLife: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    tagline: 'Intelligent Packaging. Longer Freshness.',
    subTagline: 'AI-powered food packaging recommendations based on food properties, barrier physics (OTR/WVTR), cost and sustainability for India.',
    home: 'Home',
    visualStory: 'Visual Story',
    aiRecommend: 'AI Recommend',
    lab3d: '3D Lab',
    materials: 'Materials',
    shelfLife: 'Shelf Life',
    map: 'MAP',
    compliance: 'FSSAI / BIS',
    cost: 'Cost',
    sustainability: 'Eco',
    coldChain: 'Cold Chain IoT',
    roiCalc: 'Mandi ROI',
    farmerMode: 'Farmer Mode',
    dashboard: 'Dashboard',
    startAiRecommendation: 'Start AI Recommendation',
    explore3dLab: 'Explore 3D Packaging Lab',
    voiceAssistant: 'PackWise Vaani (Voice AI)',
    speakAdvice: 'Read Out Recommendation',
    listening: 'Listening to your voice...',
    tapToSpeak: 'Click to speak a voice command',
    voiceWelcome: 'Namaste! I am PackWise Vaani. Ask me about Indian food packaging or tell me what crop you are storing.',
    whyThisPackageTitle: 'Why this package structure?',
    recommendedStructure: 'Recommended Primary Structure',
    compatibility: 'AI Compatibility',
    daysShelfLife: 'Days Freshness Window',
  },
  hi: {
    tagline: 'स्मार्ट पैकेजिंग। लंबी ताज़गी।',
    subTagline: 'फसल के गुणों, गैस अवरोधक भौतिकी (OTR/WVTR), लागत और स्थिरता पर आधारित AI-संचालित पैकेजिंग सिफारिशें।',
    home: 'होम',
    visualStory: 'दृश्य कहानी',
    aiRecommend: 'AI सिफारिश',
    lab3d: '3D लैब',
    materials: 'सामग्री लाइब्रेरी',
    shelfLife: 'शेल्फ लाइफ',
    map: 'MAP वातावरण',
    compliance: 'FSSAI / BIS मानक',
    cost: 'लागत अनुकूलन',
    sustainability: 'पर्यावरण स्कोर',
    coldChain: 'कोल्ड चेन IoT',
    roiCalc: 'मंडी ROI बचत',
    farmerMode: 'किसान / आसान मोड',
    dashboard: 'कमांड सेंटर',
    startAiRecommendation: 'AI सिफारिश शुरू करें',
    explore3dLab: '3D लैब देखें',
    voiceAssistant: 'पैकवाइज वाणी (आवाज AI)',
    speakAdvice: 'सलाह बोलकर सुनाएं',
    listening: 'आपकी आवाज सुन रहे हैं...',
    tapToSpeak: 'आवाज से बोलने के लिए माइक दबाएं',
    voiceWelcome: 'नमस्ते! मैं पैकवाइज वाणी हूँ। मुझसे पैकेजिंग के बारे में पूछें या अपनी फसल का नाम बताएं।',
    whyThisPackageTitle: 'यह थैली या सामग्री क्यों चुनी गई?',
    recommendedStructure: 'सुझाई गई मुख्य पैकेजिंग',
    compatibility: 'AI अनुकूलता स्कोर',
    daysShelfLife: 'दिन ताज़गी अवधि',
  },
  mr: {
    tagline: 'स्मार्ट पॅकेजिंग. दीर्घ ताजेपणा.',
    subTagline: 'अन्नाचे गुणधर्म, श्वसन दर आणि हवामान यावर आधारित AI पॅकेजिंग शिफारसी.',
    home: 'मुख्यपृष्ठ',
    visualStory: 'दृश्य कथा',
    aiRecommend: 'AI शिफारस',
    lab3d: '3D लॅब',
    materials: 'साहित्य',
    shelfLife: 'टिकाऊ क्षमता',
    map: 'MAP तंत्रज्ञान',
    compliance: 'FSSAI / BIS',
    cost: 'खर्च गणित',
    sustainability: 'पर्यावरण',
    coldChain: 'कोल्ड चेन IoT',
    roiCalc: 'मार्केट नफा ROI',
    farmerMode: 'शेतकरी सोपा मोड',
    dashboard: 'डॅशबोर्ड',
    startAiRecommendation: 'AI शिफारस सुरू करा',
    explore3dLab: '3D लॅब पहा',
    voiceAssistant: 'पॅकवाइज वाणी (व्हॉइस AI)',
    speakAdvice: 'सल्ला ऐका',
    listening: 'तुमचा आवाज ऐकत आहे...',
    tapToSpeak: 'बोलण्यासाठी माइक दाबा',
    voiceWelcome: 'नमस्कार! मी पॅकवाइज वाणी आहे. मला शेतमाल पॅकेजिंगबद्दल विचारा.',
    whyThisPackageTitle: 'हे पॅकेजिंग का निवडले?',
    recommendedStructure: 'शिफारस केलेले पॅकेजिंग',
    compatibility: 'AI सुसंगतता',
    daysShelfLife: 'दिवस ताजेपणा',
  },
  ta: {
    tagline: 'புத்திசாலி பேக்கேஜிங். நீண்ட புத்துணர்ச்சி.',
    subTagline: 'உணவு பண்புகள், சுவாசம் மற்றும் சுற்றுச்சூழல் பாதுகாப்பு அடிப்படையில் AI பேக்கேஜிங் பரிந்துரைகள்.',
    home: 'முகப்பு',
    visualStory: 'காட்சி கதை',
    aiRecommend: 'AI பரிந்துரை',
    lab3d: '3D ஆய்வகம்',
    materials: 'பொருட்கள்',
    shelfLife: 'ஆயுட்காலம்',
    map: 'MAP தொழில்நுட்பம்',
    compliance: 'FSSAI / BIS',
    cost: 'செலவு கணக்கீடு',
    sustainability: 'சுற்றுச்சூழல்',
    coldChain: 'குளிர் சங்கிலி IoT',
    roiCalc: 'மண்டி லாபம் ROI',
    farmerMode: 'விவசாயி முறை',
    dashboard: 'டாஷ்போர்டு',
    startAiRecommendation: 'AI பரிந்துரையைத் தொடங்குக',
    explore3dLab: '3D ஆய்வகத்தைக் காண்க',
    voiceAssistant: 'பேக்வைஸ் வாணி (குரல் AI)',
    speakAdvice: 'பரிந்துரையை வாசிக்கவும்',
    listening: 'கேட்கிறது...',
    tapToSpeak: 'பேச மைக்ரோஃபோனை அழுத்தவும்',
    voiceWelcome: 'வணக்கம்! நான் பேக்வைஸ் வாணி. உணவு பேக்கேஜிங் பற்றி கேளுங்கள்.',
    whyThisPackageTitle: 'இந்த பேக்கேஜிங் ஏன் தேர்வு செய்யப்பட்டது?',
    recommendedStructure: 'பரிந்துரைக்கப்பட்ட அமைப்பு',
    compatibility: 'AI பொருத்தம்',
    daysShelfLife: 'நாட்கள் புத்துணர்ச்சி',
  },
  te: {
    tagline: 'స్మార్ట్ ప్యాకేజింగ్. ఎక్కువ తాజాదనం.',
    subTagline: 'ఆహార గుణాలు మరియు నిల్వ పరిస్థితుల ఆధారంగా AI ప్యాకేజింగ్ సిఫార్సులు.',
    home: 'హోమ్',
    visualStory: 'విజువల్ కథ',
    aiRecommend: 'AI సిఫార్సు',
    lab3d: '3D ల్యాబ్',
    materials: 'మెటీరియల్స్',
    shelfLife: 'షెల్ఫ్ లైఫ్',
    map: 'MAP సిస్టమ్',
    compliance: 'FSSAI / BIS',
    cost: 'ధర అంచనా',
    sustainability: 'పర్యావరణం',
    coldChain: 'కోల్డ్ చైన్ IoT',
    roiCalc: 'మండి లాభం ROI',
    farmerMode: 'రైతు సులభ మోడ్',
    dashboard: 'డాష్‌బోర్డ్',
    startAiRecommendation: 'AI సిఫార్సు ప్రారంభించండి',
    explore3dLab: '3D ల్యాబ్ చూడండి',
    voiceAssistant: 'ప్యాక్‌వైజ్ వాణి (వాయిస్ AI)',
    speakAdvice: 'సలహాను వినండి',
    listening: 'వింటున్నాము...',
    tapToSpeak: 'మాట్లాడటానికి మైక్ క్లిక్ చేయండి',
    voiceWelcome: 'నమస్కారం! నేను ప్యాక్‌వైజ్ వాణిని. ఆహార ప్యాకేజింగ్ గురించి అడగండి.',
    whyThisPackageTitle: 'ఈ ప్యాకేజీ ఎందుకు ఎంపిక చేయబడింది?',
    recommendedStructure: 'సిఫార్సు చేయబడిన ప్యాకేజింగ్',
    compatibility: 'AI అనుకూలత',
    daysShelfLife: 'రోజుల తాజాదనం',
  },
  gu: {
    tagline: 'સ્માર્ટ પેકેજિંગ. લાંબી તાજગી.',
    subTagline: 'ખોરાકના ગુણધર્મો અને વૈજ્ઞાનિક વિશ્લેષણ પર આધારિત AI પેકેજિંગ ભલામણો.',
    home: 'હોમ',
    visualStory: 'દ્રશ્ય વાર્તા',
    aiRecommend: 'AI ભલામણ',
    lab3d: '3D લેબ',
    materials: 'સામગ્રી',
    shelfLife: 'શેલ્ફ લાઇફ',
    map: 'MAP ગેસ વાતાવરણ',
    compliance: 'FSSAI / BIS',
    cost: 'ખર્ચ ગણતરી',
    sustainability: 'ઇકો સ્કોર',
    coldChain: 'કોલ્ડ ચેઈન IoT',
    roiCalc: 'મંડી નફો ROI',
    farmerMode: 'ખેડૂત સરળ મોડ',
    dashboard: 'ડેશબોર્ડ',
    startAiRecommendation: 'AI ભલામણ શરૂ કરો',
    explore3dLab: '3D લેબ જુઓ',
    voiceAssistant: 'પેકવાઇઝ વાણી (વોઇસ AI)',
    speakAdvice: 'સલાહ સાંભળો',
    listening: 'સાંભળી રહ્યા છીએ...',
    tapToSpeak: 'બોલવા માટે માઇક દબાવો',
    voiceWelcome: 'નમસ્તે! હું પેકવાઇઝ વાણી છું. મને ખોરાક પેકેજિંગ વિશે પૂછો.',
    whyThisPackageTitle: 'આ પેકેજિંગ કેમ પસંદ કરવામાં આવ્યું?',
    recommendedStructure: 'ભલામણ કરેલ પેકેજિંગ',
    compatibility: 'AI સુસંગતતા',
    daysShelfLife: 'દિવસો તાજગી',
  },
  bn: {
    tagline: 'স্মার্ট প্যাকেজিং। দীর্ঘস্থায়ী সতেজতা।',
    subTagline: 'খাদ্যের গুণাগুণ ও বায়বীয় বাধার ওপর ভিত্তি করে উন্নত AI প্যাকেজিং নির্দেশিকা।',
    home: 'হোম',
    visualStory: 'ভিজ্যুয়াল স্টোরি',
    aiRecommend: 'AI সুপারিশ',
    lab3d: '3D ল্যাব',
    materials: 'প্যাকেজিং উপাদান',
    shelfLife: 'স্থায়িত্ব কাল',
    map: 'MAP বায়ুমণ্ডল',
    compliance: 'FSSAI / BIS',
    cost: 'খরচ গণনা',
    sustainability: 'পরিবেশগত স্কোর',
    coldChain: 'কোল্ড চেইন IoT',
    roiCalc: 'মান্ডি লাভ ROI',
    farmerMode: 'কৃষক সহজ মোড',
    dashboard: 'ড্যাশবোর্ড',
    startAiRecommendation: 'AI সুপারিশ শুরু করুন',
    explore3dLab: '3D ল্যাব দেখুন',
    voiceAssistant: 'প্যাকওয়াইজ বাণী (ভয়েস AI)',
    speakAdvice: 'পরামর্শ শুনুন',
    listening: 'শুনছি...',
    tapToSpeak: 'কথা বলতে মাইকে চাপ দিন',
    voiceWelcome: 'নমস্কার! আমি প্যাকওয়াইজ বাণী। ফসল ও খাদ্য প্যাকেজিং সংক্রান্ত প্রশ্ন করুন।',
    whyThisPackageTitle: 'কেন এই প্যাকেজিং নির্বাচিত হয়েছে?',
    recommendedStructure: 'প্রস্তাবিত প্যাকেজিং',
    compatibility: 'AI সামঞ্জস্যতা',
    daysShelfLife: 'দিন সতেজতার সময়সীমা',
  },
  pa: {
    tagline: 'ਸਮਾਰਟ ਪੈਕੇਜਿੰਗ। ਲੰਬੀ ਤਾਜ਼ਗੀ।',
    subTagline: 'ਭੋਜਨ ਗੁਣਵੱਤਾ ਅਤੇ ਸਟੋਰੇਜ ਹਾਲਾਤਾਂ ਤੇ ਅਧਾਰਤ AI ਪੈਕੇਜਿੰਗ ਸਲਾਹ।',
    home: 'ਮੁੱਖ ਪੰਨਾ',
    visualStory: 'ਦ੍ਰਿਸ਼ ਕਹਾਣੀ',
    aiRecommend: 'AI ਸਿਫਾਰਸ਼',
    lab3d: '3D ਲੈਬ',
    materials: 'ਪੈਕੇਜਿੰਗ ਸਮੱਗਰੀ',
    shelfLife: 'ਸ਼ੈਲਫ ਲਾਈਫ',
    map: 'MAP ਵਾਤਾਵਰਣ',
    compliance: 'FSSAI / BIS',
    cost: 'ਖਰਚਾ ਗਣਨਾ',
    sustainability: 'ਵਾਤਾਵਰਣ ਸਕੋਰ',
    coldChain: 'ਕੋਲਡ ਚੇਨ IoT',
    roiCalc: 'ਮੰਡੀ ਬੱਚਤ ROI',
    farmerMode: 'ਕਿਸਾਨ ਸਰਲ ਮੋਡ',
    dashboard: 'ਡੈਸ਼ਬੋਰਡ',
    startAiRecommendation: 'AI ਸਿਫਾਰਸ਼ ਸ਼ੁਰੂ ਕਰੋ',
    explore3dLab: '3D ਲੈਬ ਵੇਖੋ',
    voiceAssistant: 'ਪੈਕਵਾਈਜ਼ ਵਾਣੀ (ਆਵਾਜ਼ AI)',
    speakAdvice: 'ਸਲਾਹ ਬੋਲ ਕੇ ਸੁਣੋ',
    listening: 'ਸੁਣ ਰਹੇ ਹਾਂ...',
    tapToSpeak: 'ਬੋਲਣ ਲਈ ਮਾਈਕ ਦਬਾਓ',
    voiceWelcome: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਪੈਕਵਾਈਜ਼ ਵਾਣੀ ਹਾਂ। ਮੈਨੂੰ ਫਸਲ ਪੈਕੇਜਿੰਗ ਬਾਰੇ ਪੁੱਛੋ।',
    whyThisPackageTitle: 'ਇਹ ਪੈਕੇਟਿੰਗ ਕਿਉਂ ਚੁਣੀ ਗਈ?',
    recommendedStructure: 'ਸਿਫਾਰਸ਼ ਕੀਤੀ ਪੈਕੇਜਿੰਗ',
    compatibility: 'AI ਅਨੁਕੂਲਤਾ',
    daysShelfLife: 'ਦਿਨ ਤਾਜ਼ਗੀ ਸਮਾਂ',
  },
};
