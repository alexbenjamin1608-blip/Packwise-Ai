import { useState, useEffect, useCallback, useRef } from 'react';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../i18n/translations';

interface VoiceAssistantProps {
  currentLanguage: SupportedLanguage;
  onCommandRecognized?: (command: string) => void;
}

export function useVoiceAssistant({ currentLanguage, onCommandRecognized }: VoiceAssistantProps) {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition if supported in browser
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    // Match recognition language to current app language
    const currentLangMeta = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage);
    recognition.lang = currentLangMeta?.speechLocale || 'en-IN';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const text = event.results[current][0].transcript;
      setTranscript(text);

      if (event.results[current].isFinal) {
        handleVoiceCommand(text.toLowerCase());
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Voice recognition notice:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [currentLanguage]);

  // Voice Command Intent Classifier
  const handleVoiceCommand = (text: string) => {
    if (!onCommandRecognized) return;

    if (
      text.includes('recommend') ||
      text.includes('सिफारिश') ||
      text.includes('सुझाव') ||
      text.includes('सलाह') ||
      text.includes('பரிந்துரை')
    ) {
      onCommandRecognized('recommend');
    } else if (
      text.includes('3d') ||
      text.includes('lab') ||
      text.includes('लैब') ||
      text.includes('ஆய்வகம்')
    ) {
      onCommandRecognized('lab3d');
    } else if (
      text.includes('story') ||
      text.includes('कहानी') ||
      text.includes('दृश्य') ||
      text.includes('frame')
    ) {
      onCommandRecognized('storyboard');
    } else if (
      text.includes('farmer') ||
      text.includes('किसान') ||
      text.includes('शेतकरी') ||
      text.includes('आसान') ||
      text.includes('aasaan')
    ) {
      onCommandRecognized('farmerMode');
    } else if (
      text.includes('cold') ||
      text.includes('chain') ||
      text.includes('कोल्ड') ||
      text.includes('ट्रक')
    ) {
      onCommandRecognized('coldchain');
    } else if (
      text.includes('cost') ||
      text.includes('लागत') ||
      text.includes('खर्च') ||
      text.includes('roi') ||
      text.includes('नफा')
    ) {
      onCommandRecognized('roi');
    } else if (
      text.includes('shelf') ||
      text.includes('life') ||
      text.includes('शेल्फ') ||
      text.includes('ताज़गी')
    ) {
      onCommandRecognized('shelflife');
    } else if (text.includes('map') || text.includes('गैस')) {
      onCommandRecognized('map');
    } else if (text.includes('home') || text.includes('होम') || text.includes('घर')) {
      onCommandRecognized('home');
    }
  };

  // Start Listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      setTranscript('');
      recognitionRef.current.start();
    } catch (e) {
      console.warn('Recognition already started or error:', e);
    }
  }, []);

  // Stop Listening
  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
  }, []);

  // Text-To-Speech: Speak given text
  const speakText = useCallback(
    (text: string) => {
      if (!('speechSynthesis' in window)) return;

      window.speechSynthesis.cancel(); // Cancel any ongoing speech

      const utterance = new SpeechSynthesisUtterance(text);
      const currentLangMeta = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage);
      utterance.lang = currentLangMeta?.speechLocale || 'en-IN';
      utterance.rate = 0.95; // slightly slower for high clarity
      utterance.pitch = 1.0;

      // Match available voices
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(
        (v) =>
          v.lang.startsWith(currentLangMeta?.speechLocale || 'en-IN') ||
          v.lang.startsWith(currentLanguage)
      );
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [currentLanguage]
  );

  // Stop Speaking
  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isSpeaking,
    isListening,
    transcript,
    speechSupported,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
  };
}
