import React, { useState } from 'react';
import {
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  User,
} from 'lucide-react';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';
import { generateFoodPackagingAdviceAsync } from '../services/aiFoodAdvisor';

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
  const [isThinking, setIsThinking] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputValue || voiceTranscript;
    if (!query.trim() || isThinking) return;

    const userMsg: Message = { id: String(Date.now()), sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    // Try Gemini AI first, fall back to local knowledge base
    const advice = await generateFoodPackagingAdviceAsync(query, currentLanguage);
    const reply = advice.replyText;

    setIsThinking(false);
    const aiMsg: Message = { id: String(Date.now() + 1), sender: 'ai', text: reply };
    setMessages((prev) => [...prev, aiMsg]);
    onSpeakText(reply);
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
                  GEMINI POWERED
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Indian Food Packaging &amp; Respiration Science Assistant
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
            'Cherry Tomato MAP Storage',
            'Kashmiri Apple Packaging',
            'Malai Paneer Vacuum Packing',
            'Basmati Rice Moisture Lock',
            'Turmeric Light Barrier',
            'FSSAI IS 9845 Migration Rules',
          ].map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              disabled={isThinking}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 whitespace-nowrap transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Gemini AI Thinking Indicator */}
          {isThinking && (
            <div className="flex gap-3 text-xs justify-start">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4 text-cyan-300 animate-pulse" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-cyan-500/30 text-cyan-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-[11px] ml-1 text-slate-400">Gemini AI thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Voice Input Indicator */}
        {isListening && (
          <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-300 flex items-center justify-between mb-2">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Listening: &quot;{voiceTranscript || 'Speak now...'}&quot;</span>
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
            disabled={isThinking}
            className="flex-1 p-2.5 rounded-xl text-xs glass-input text-white placeholder-slate-500 disabled:opacity-60"
          />

          <button
            onClick={() => handleSend()}
            disabled={isThinking}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
