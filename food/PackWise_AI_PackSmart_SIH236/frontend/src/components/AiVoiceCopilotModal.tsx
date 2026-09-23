import React, { useState } from 'react';
import {
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  HelpCircle,
} from 'lucide-react';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

interface AiVoiceCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: SupportedLanguage;
  onSpeakText: (text: string) => void;
  onStopSpeaking: () => void;
  isSpeaking: boolean;
  onStartVoiceInput: () => void;
  onStopVoiceInput: () => void;
  isListening: boolean;
  voiceTranscript: string;
}

const FAQ_KNOWLEDGE: Record<string, string> = {
  mango:
    'Alphonso mangoes are climacteric fruits with high respiration (40-60 mg CO₂/kg·h) and high ethylene sensitivity. Optimal packaging is a laser micro-perforated PE film or MAP pouch with 5% O₂, 10% CO₂, 85% N₂ stored at 12°C - 14°C. This avoids chilling injury while extending freshness to 18 days.',
  paneer:
    'Malai Paneer requires vacuum barrier packaging (PA/EVOH/PE) or modified atmosphere with 30% CO₂ and 70% N₂ stored strictly under 4°C. This inhibits Pseudomonas psychrotrophic bacterial slime and lactic souring for 25 to 30 days.',
  fssai:
    'Under FSSAI (Packaging) Regulations 2018 and BIS IS 9845, the Overall Migration Limit (OML) for food-contact plastics is 60 mg/kg (or 10 mg/dm²). Virgin food-grade resins compliant with IS 10146 (PE) or IS 10142 (PP) must be used, with zero post-consumer recycled plastic in direct food contact.',
  turmeric:
    'Turmeric contains light-sensitive curcumin which degrades rapidly under sunlight and oxygen. 3-ply Aluminium Foil laminate (PET / Alu Foil 9µm / PE 75µm) offers absolute light and oxygen barrier, preserving bioactive curcumin and volatile turmerone for over 18 months.',
  hindi_mango:
    'आम एक सांस लेने वाला फल है। इसे पूरी तरह बंद थैली में न रखें। सूक्ष्म छिद्र वाली थैली (Micro-Perforated Pouch) इस्तेमाल करें और 12°C से 14°C तापमान में रखें। इससे फल 18 दिन तक ताज़ा रहेगा और उसमें शराब जैसी गंध नहीं आएगी।',
};

export const AiVoiceCopilotModal: React.FC<AiVoiceCopilotModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSpeakText,
  onStopSpeaking,
  isSpeaking,
  onStartVoiceInput,
  onStopVoiceInput,
  isListening,
  voiceTranscript,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: TRANSLATIONS[currentLanguage].voiceWelcome,
    },
  ]);
  const [inputValue, setInputValue] = useState<string>('');

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputValue || voiceTranscript;
    if (!query.trim()) return;

    const userMsg: Message = { id: String(Date.now()), sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    // Generate intelligent food science answer
    setTimeout(() => {
      let reply =
        'PackWise AI heuristic engine recommends balancing respiration rates with gas permeation (OTR/WVTR). For fresh produce, maintain controlled airflow; for fatty or dry foods, use high-barrier metallized or EVOH films.';

      const lower = query.toLowerCase();
      if (lower.includes('mango') || lower.includes('aam') || lower.includes('आम')) {
        reply = currentLanguage === 'hi' ? FAQ_KNOWLEDGE.hindi_mango : FAQ_KNOWLEDGE.mango;
      } else if (lower.includes('paneer') || lower.includes('पनीर') || lower.includes('dairy')) {
        reply = FAQ_KNOWLEDGE.paneer;
      } else if (lower.includes('fssai') || lower.includes('is 9845') || lower.includes('bis') || lower.includes('migration')) {
        reply = FAQ_KNOWLEDGE.fssai;
      } else if (lower.includes('turmeric') || lower.includes('haldi') || lower.includes('हल्दी') || lower.includes('spice')) {
        reply = FAQ_KNOWLEDGE.turmeric;
      }

      const aiMsg: Message = { id: String(Date.now() + 1), sender: 'ai', text: reply };
      setMessages((prev) => [...prev, aiMsg]);
      onSpeakText(reply);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl glass-card border border-cyan-500/40 p-6 shadow-2xl flex flex-col h-[580px] bg-slate-950/95">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-cyan-400 p-[1.5px]">
              <div className="w-full h-full bg-[#070B14] rounded-[9px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white font-['Outfit'] flex items-center gap-2">
                PackWise Vaani AI Copilot
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300">
                  VOICE ACTIVE
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Indian Food Packaging & Respiration Science Assistant
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Quick Question Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2 border-b border-white/5 text-[11px]">
          <span className="text-slate-500 shrink-0">Try asking:</span>
          {[
            'Alphonso Mango MAP Storage',
            'FSSAI IS 9845 Migration Rules',
            'Malai Paneer Vacuum Packing',
            'Turmeric Light Barrier',
          ].map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 text-xs sm:text-sm ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-cyan-300" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl max-w-[80%] leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-medium'
                    : 'bg-slate-900 border border-white/10 text-slate-100'
                }`}
              >
                {m.text}

                {m.sender === 'ai' && (
                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-end">
                    <button
                      onClick={() => (isSpeaking ? onStopSpeaking() : onSpeakText(m.text))}
                      className="text-[11px] text-cyan-300 flex items-center gap-1 hover:underline"
                    >
                      {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                      <span>{isSpeaking ? 'Mute' : 'Listen'}</span>
                    </button>
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-amber-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Voice Input Indicator */}
        {isListening && (
          <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-300 flex items-center justify-between mb-2">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Listening: "{voiceTranscript || 'Speak now...'}"</span>
            </span>
            <button
              onClick={onStopVoiceInput}
              className="text-[11px] font-bold text-white hover:underline"
            >
              Done Speaking
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="pt-3 border-t border-white/10 flex items-center gap-2">
          <button
            onClick={isListening ? onStopVoiceInput : onStartVoiceInput}
            className={`p-2.5 rounded-xl transition-all ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-white/5 hover:bg-white/10 text-amber-400 border border-white/10'
            }`}
            title="Voice Mic Input"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            placeholder="Ask anything about packaging, crops, or standards..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 p-2.5 rounded-xl text-xs glass-input text-white placeholder-slate-500"
          />

          <button
            onClick={() => handleSend()}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
