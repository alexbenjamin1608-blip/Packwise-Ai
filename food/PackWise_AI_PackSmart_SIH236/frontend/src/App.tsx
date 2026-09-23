import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StoryboardSequence } from './components/StoryboardSequence';
import { PackagingLab3D } from './components/PackagingLab3D';
import { AiRecommendationWizard } from './components/AiRecommendationWizard';
import { RecommendationResult } from './components/RecommendationResult';
import { BarrierAnalytics } from './components/BarrierAnalytics';
import { MapSimulator } from './components/MapSimulator';
import { ShelfLifePredictor } from './components/ShelfLifePredictor';
import { CommodityDatabase } from './components/CommodityDatabase';
import { MaterialLibrary } from './components/MaterialLibrary';
import { ComplianceChecker } from './components/ComplianceChecker';
import { CostOptimizer } from './components/CostOptimizer';
import { SustainabilityScore } from './components/SustainabilityScore';
import { FarmerSimpleMode } from './components/FarmerSimpleMode';
import { LiveCropScannerModal } from './components/LiveCropScannerModal';
import { TraceabilityReport } from './components/TraceabilityReport';
import { FuturisticDashboard } from './components/FuturisticDashboard';
import { ColdChainTracker } from './components/ColdChainTracker';
import { RoiCalculator } from './components/RoiCalculator';
import { VoiceAssistantBar } from './components/VoiceAssistantBar';
import { AiVoiceCopilotModal } from './components/AiVoiceCopilotModal';
import { Quantum3dDashboard } from './components/Quantum3dDashboard';
import { Footer } from './components/Footer';
import { RecommendationResultData } from './types/packaging';
import { runPackagingRecommendation } from './utils/recommendationEngine';
import { SupportedLanguage, TRANSLATIONS } from './i18n/translations';
import { useVoiceAssistant } from './hooks/useVoiceAssistant';
import { ArrowRight, Sparkles, Box, Wheat, ShieldCheck, Truck, TrendingUp } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isSimpleMode, setIsSimpleMode] = useState<boolean>(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);
  const [isVoiceCopilotOpen, setIsVoiceCopilotOpen] = useState<boolean>(false);
  const [isCameraScannerOpen, setIsCameraScannerOpen] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');

  // Initialize with Alphonso Mango recommendation
  const [recommendationResult, setRecommendationResult] = useState<RecommendationResultData>(() =>
    runPackagingRecommendation({
      foodId: 'mango',
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
    })
  );

  // Voice Assistant Hook
  const {
    isSpeaking,
    isListening,
    transcript,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
  } = useVoiceAssistant({
    currentLanguage,
    onCommandRecognized: (command) => {
      if (command === 'farmerMode') {
        setIsSimpleMode((prev) => !prev);
      } else {
        setIsSimpleMode(false);
        setActiveTab(command);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  });

  const handleRecommendationGenerated = (result: RecommendationResultData) => {
    setRecommendationResult(result);
    setActiveTab('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Speak out brief advice in the active language
    const speechMsg =
      currentLanguage === 'hi'
        ? `${result.food.name} के लिए ${result.material.name} सुझाई गई है। AI अनुकूलता स्कोर ${result.compatibilityScore} प्रतिशत है, जिससे ताज़गी 18 दिन तक बनी रहेगी।`
        : `PackWise AI recommends ${result.material.name} for ${result.food.name} with ${result.compatibilityScore}% compatibility, extending freshness to 18 days.`;
    speakText(speechMsg);
  };

  const handleSpeakCurrentAdvice = () => {
    const text =
      currentLanguage === 'hi'
        ? `${recommendationResult.food.name} के लिए अनुशंसित पैकेजिंग: ${recommendationResult.material.name}। कारण: ${recommendationResult.whyThisPackage} अनुमानित ताज़गी: 18 दिन।`
        : `Recommended packaging for ${recommendationResult.food.name} is ${recommendationResult.material.name}. ${recommendationResult.whyThisPackage} Projected shelf life is 18 days.`;
    speakText(text);
  };

  const handleLiveCropDetected = (cropName: string, hindiName: string, _category: string) => {
    const lower = cropName.toLowerCase();
    const id = lower.includes('mango')
      ? 'mango'
      : lower.includes('tomato')
      ? 'tomato'
      : lower.includes('onion')
      ? 'onion'
      : lower.includes('potato')
      ? 'potato'
      : lower.includes('rice')
      ? 'rice'
      : 'mango';

    const result = runPackagingRecommendation({
      foodId: id,
      moisture: id === 'rice' ? 'Low' : 'High',
      waterActivity: id === 'rice' ? 0.60 : 0.95,
      fatOilPercent: 0.5,
      ph: id === 'tomato' ? 4.3 : 5.0,
      respirationRate: (id === 'mango' || id === 'tomato') ? 'High' : 'Low',
      ethyleneSensitivity: id === 'mango' ? 'High' : 'Medium',
      oxygenSensitivity: 'Medium',
      lightSensitivity: 'Medium',
      desiredShelfLifeDays: id === 'rice' ? 365 : (id === 'potato' || id === 'onion') ? 45 : 18,
      storageCondition: (id === 'rice' || id === 'potato' || id === 'onion') ? 'Ambient' : 'Chilled',
      storageTempC: (id === 'rice' || id === 'potato' || id === 'onion') ? 24 : 12,
      relativeHumidityPercent: 80,
      region: 'West India',
      transportType: 'Standard Truck',
      transportDurationHours: 24,
      distanceKm: 500,
      vibrationLevel: 'Medium',
      priority: 'map',
    });

    setRecommendationResult(result);
    setIsCameraScannerOpen(false);
    setActiveTab('result');
    setIsSimpleMode(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const spokenMsg =
      currentLanguage === 'hi'
        ? `कैमरे ने ${hindiName} पहचाना! AI ने इसके लिए ${result.material.name} की सिफारिश तैयार की है।`
        : `Live Vision detected ${cropName}! PackWise AI recommended ${result.material.name}.`;
    speakText(spokenMsg);
  };

  const t = TRANSLATIONS[currentLanguage];

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setIsSimpleMode(false);
          setActiveTab(tab);
        }}
        isSimpleMode={isSimpleMode}
        setIsSimpleMode={setIsSimpleMode}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onOpenVoiceCopilot={() => setIsVoiceCopilotOpen(true)}
        onOpenScanCamera={() => setIsCameraScannerOpen(true)}
        isVoiceActive={isSpeaking || isListening}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {/* Simple Farmer Mode Override if active */}
        {isSimpleMode ? (
          <div className="pt-20">
            <FarmerSimpleMode
              currentLanguage={currentLanguage}
              onLanguageChange={setCurrentLanguage}
              onSpeakText={speakText}
              isSpeaking={isSpeaking}
              onStopSpeaking={stopSpeaking}
            />
          </div>
        ) : (
          <>
            {/* HOME VIEW: Seamless immersive visual flow */}
            {activeTab === 'home' && (
              <div className="space-y-12 sm:space-y-16">
                {/* 1. Immersive Hero with floating 3D mango & Indian agricultural background */}
                <HeroSection
                  onStartRecommendation={() => {
                    setActiveTab('recommend');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onExplore3DLab={() => {
                    setActiveTab('lab3d');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenStoryboard={() => {
                    setActiveTab('storyboard');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />

                {/* 1b. Quantum 3D TOPSIS Multi-Criteria Packaging Optimizer */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                  <Quantum3dDashboard />
                </div>

                {/* 2. Visual Storyboard Sequence (50 frames from Indian farm to AI lab) */}
                <div className="pt-4">
                  <StoryboardSequence />
                </div>

                {/* 3. Interactive 3D Packaging Laboratory */}
                <div className="pt-4">
                  <PackagingLab3D />
                </div>

                {/* 4. Barrier Analytics (OTR / WVTR) */}
                <div className="pt-4">
                  <BarrierAnalytics />
                </div>

                {/* 5. Cold Chain Logistics Tracker & Spoilage Simulator */}
                <div className="pt-4">
                  <ColdChainTracker />
                </div>

                {/* 6. Modified Atmosphere Packaging (MAP) Simulator */}
                <div className="pt-4">
                  <MapSimulator />
                </div>

                {/* 7. Mandi Spoilage & Packaging ROI Calculator */}
                <div className="pt-4">
                  <RoiCalculator />
                </div>

                {/* 8. Shelf-Life Freshness Timeline */}
                <div className="pt-4">
                  <ShelfLifePredictor />
                </div>

                {/* 9. Quick Launch Banner to Farmer Mode */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="p-6 sm:p-8 rounded-3xl glass-card-gold border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-center sm:text-left">
                      <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1.5">
                        <Wheat className="w-4 h-4 text-amber-400" /> किसान व छोटे खाद्य व्यापारियों के लिए
                      </span>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit']">
                        Aasaan Mode: 6 सरल सवालों में सही पैकेजिंग चुनें
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                        बिना किसी तकनीकी जटिलता के आम, आलू, दाल, और पनीर के लिए सही थैली, तापमान, और शेल्फ-लाइफ का सुझाव प्राप्त करें।
                      </p>
                    </div>

                    <button
                      onClick={() => setIsSimpleMode(true)}
                      className="px-6 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-lg shadow-amber-500/30 hover:opacity-95 transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                      सरल मोड शुरू करें <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: QUANTUM 3D TOPSIS OPTIMIZER */}
            {activeTab === 'quantum' && (
              <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Quantum3dDashboard />
              </div>
            )}

            {/* TAB: VISUAL STORYBOARD */}
            {activeTab === 'storyboard' && (
              <div className="pt-20">
                <StoryboardSequence />
              </div>
            )}

            {/* TAB: AI RECOMMENDATION WIZARD */}
            {activeTab === 'recommend' && (
              <div className="pt-20">
                <AiRecommendationWizard onRecommendationGenerated={handleRecommendationGenerated} />
              </div>
            )}

            {/* TAB: AI RECOMMENDATION RESULT */}
            {activeTab === 'result' && (
              <div className="pt-20">
                <RecommendationResult
                  result={recommendationResult}
                  onOpenLab3D={() => {
                    setActiveTab('lab3d');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenShelfLife={() => {
                    setActiveTab('shelflife');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenCost={() => {
                    setActiveTab('cost');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenTraceability={() => {
                    setActiveTab('traceability');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onReset={() => {
                    setActiveTab('recommend');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}

            {/* TAB: 3D PACKAGING LAB */}
            {activeTab === 'lab3d' && (
              <div className="pt-20">
                <PackagingLab3D initialMaterialId={recommendationResult.material.id} />
              </div>
            )}

            {/* TAB: COMMODITY DATABASE */}
            {activeTab === 'database' && (
              <div className="pt-20">
                <CommodityDatabase />
              </div>
            )}

            {/* TAB: MATERIALS & COMPARISON */}
            {activeTab === 'materials' && (
              <div className="pt-20">
                <MaterialLibrary />
              </div>
            )}

            {/* TAB: COLD CHAIN LOGISTICS TRACKER */}
            {activeTab === 'coldchain' && (
              <div className="pt-20">
                <ColdChainTracker />
              </div>
            )}

            {/* TAB: MANDI SPOILAGE & ROI CALCULATOR */}
            {activeTab === 'roi' && (
              <div className="pt-20">
                <RoiCalculator />
              </div>
            )}

            {/* TAB: SHELF LIFE PREDICTOR */}
            {activeTab === 'shelflife' && (
              <div className="pt-20">
                <ShelfLifePredictor />
              </div>
            )}

            {/* TAB: MAP SIMULATOR */}
            {activeTab === 'map' && (
              <div className="pt-20">
                <MapSimulator />
              </div>
            )}

            {/* TAB: FSSAI & BIS COMPLIANCE */}
            {activeTab === 'compliance' && (
              <div className="pt-20">
                <ComplianceChecker />
              </div>
            )}

            {/* TAB: COST OPTIMIZER */}
            {activeTab === 'cost' && (
              <div className="pt-20">
                <CostOptimizer />
              </div>
            )}

            {/* TAB: SUSTAINABILITY */}
            {activeTab === 'sustainability' && (
              <div className="pt-20">
                <SustainabilityScore />
              </div>
            )}

            {/* TAB: TRACEABILITY & QR PASS */}
            {activeTab === 'traceability' && (
              <div className="pt-20">
                <TraceabilityReport result={recommendationResult} />
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Voice Assistant Bar HUD */}
      <VoiceAssistantBar
        currentLanguage={currentLanguage}
        isSpeaking={isSpeaking}
        isListening={isListening}
        transcript={transcript}
        onStartListening={startListening}
        onStopListening={stopListening}
        onSpeakCurrentAdvice={handleSpeakCurrentAdvice}
        onStopSpeaking={stopSpeaking}
        onOpenCopilot={() => setIsVoiceCopilotOpen(true)}
      />

      {/* Full AI Voice Copilot Modal */}
      <AiVoiceCopilotModal
        isOpen={isVoiceCopilotOpen}
        onClose={() => setIsVoiceCopilotOpen(false)}
        currentLanguage={currentLanguage}
        onSpeakText={speakText}
        onStopSpeaking={stopSpeaking}
        isSpeaking={isSpeaking}
        onStartVoiceInput={startListening}
        onStopVoiceInput={stopListening}
        isListening={isListening}
        voiceTranscript={transcript}
      />

      {/* Futuristic Command Dashboard Modal (Frame 50 inspired) */}
      <FuturisticDashboard
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* AI Live Camera Crop Scanner Modal */}
      <LiveCropScannerModal
        isOpen={isCameraScannerOpen}
        onClose={() => setIsCameraScannerOpen(false)}
        onCropDetected={handleLiveCropDetected}
        currentLanguage={currentLanguage}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
