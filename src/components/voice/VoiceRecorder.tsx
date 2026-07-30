import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import type { RecordingState, ExtractedExpense } from '../../types/voice';
import { extractExpenseWithGemini } from '../../services/geminiService';
import { MicrophoneButton } from './MicrophoneButton';
import { LiveTranscript } from './LiveTranscript';
import { RecordingStatus } from './RecordingStatus';
import { RecordingTimer } from './RecordingTimer';
import { ProcessingLoader } from './ProcessingLoader';
import { ExpenseReviewCard } from './ExpenseReviewCard';
import { useData } from '../../context/DataContext';

// SpeechRecognition type declarations for browser support
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export interface VoiceRecorderProps {
  className?: string;
}

import { toISODateString, formatDateToStandard } from '../../utils/dateUtils';

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ className = '' }) => {
  const { addExpense } = useData();
  const [state, setState] = useState<RecordingState>('Idle');
  const [transcript, setTranscript] = useState<string>('');
  const [expenseData, setExpenseData] = useState<ExtractedExpense | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);

  // Clean up timer interval
  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, []);

  // Timer counter when Listening
  useEffect(() => {
    if (state === 'Listening') {
      setTimerSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      stopTimer();
    }
  }, [state]);

  // Start Speech Recognition
  const startRecording = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setTranscript('');
    setExpenseData(null);

    const win = window as IWindow;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setState('Browser Unsupported');
      return;
    }

    try {
      // Test microphone permission explicitly
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
    } catch (err: any) {
      console.error('Microphone permission error:', err);
      setState('Permission Denied');
      setErrorMessage(
        err?.message || 'Microphone access was denied. Please grant permission in browser settings.'
      );
      return;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN'; // Optimized for English/Indian context

    recognition.onstart = () => {
      setState('Listening');
    };

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error event:', event);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setState('Permission Denied');
        setErrorMessage('Microphone permission was denied or blocked.');
      } else if (event.error === 'network') {
        setState('Network Error');
        setErrorMessage('Network connection lost during speech recognition.');
      } else if (event.error === 'no-speech') {
        // Continue listening or notify
      } else {
        setState('Error');
        setErrorMessage(`Speech recognition error: ${event.error || 'Unknown'}`);
      }
      stopTimer();
    };

    recognition.onend = () => {};

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (e: any) {
      console.error('Failed to start recognition:', e);
      setState('Error');
      setErrorMessage('Could not initialize microphone recorder.');
    }
  };

  // Stop Speech Recognition & Trigger Gemini Extraction
  const stopRecording = async () => {
    stopTimer();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }

    if (!transcript || transcript.trim().length === 0) {
      setState('Error');
      setErrorMessage('No voice transcript was detected. Please speak into your microphone and try again.');
      return;
    }

    // Freeze transcript and move to Processing state
    setState('Processing');

    try {
      const extracted = await extractExpenseWithGemini(transcript);
      setExpenseData(extracted);
      setState('Completed');
    } catch (err: any) {
      console.error('Gemini extraction error:', err);
      setState('Error');
      setErrorMessage(err?.message || 'Failed to extract expense information from Gemini.');
    }
  };

  // Re-record / Re-speak Action: Clears transcript & buffer and starts recording fresh immediately
  const handleReRecord = async () => {
    stopTimer();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (_) {}
    }
    setTranscript('');
    setExpenseData(null);
    setTimerSeconds(0);
    setErrorMessage(null);
    setSuccessMessage(null);
    await startRecording();
  };

  // Reset Voice Recorder state to Idle
  const handleReset = () => {
    stopTimer();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (_) {}
    }
    setState('Idle');
    setTranscript('');
    setExpenseData(null);
    setTimerSeconds(0);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Save Expense Action
  const handleSaveExpense = async (extracted: ExtractedExpense) => {
    if (!extracted || !extracted.title || extracted.amount <= 0) return;

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const isoDate = toISODateString(extracted.date);
      const dateFormatted = formatDateToStandard(isoDate);

      await addExpense({
        title: extracted.title,
        amount: extracted.amount,
        category: extracted.category || 'Miscellaneous',
        paymentMethod: (extracted.paymentMethod as any) || 'UPI',
        date: dateFormatted,
        isoDate,
        notes: extracted.notes ? `${extracted.notes} (Voice: "${transcript}")` : `Voice transcript: "${transcript}"`,
        iconName: 'ShoppingBag',
        categoryColor: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30',
      });

      setSuccessMessage(`Successfully added "${extracted.title}" (₹${extracted.amount.toLocaleString('en-IN')}) to your expense ledger!`);
      
      setTimeout(() => {
        handleReset();
      }, 2200);
    } catch (err: any) {
      console.error('Error saving voice expense:', err);
      setErrorMessage(err?.message || 'Failed to save expense. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`w-full flex flex-col items-center space-y-6 ${className}`}>
      {/* Success Notification Banner */}
      {successMessage && (
        <div className="w-full max-w-lg p-4 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-center font-bold text-xs sm:text-sm flex items-center justify-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      {/* Recording Status & Timer Header */}
      <div className="flex items-center gap-3 justify-center flex-wrap">
        <RecordingStatus state={state} errorMessage={errorMessage} onRetry={handleReset} />
        {(state === 'Listening' || timerSeconds > 0) && (
          <RecordingTimer seconds={timerSeconds} isListening={state === 'Listening'} />
        )}
      </div>

      {/* Main Mic Button (Visible in Idle, Listening, and Error states) */}
      {(state === 'Idle' || state === 'Listening' || state === 'Error') && (
        <MicrophoneButton
          state={state}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          onReRecord={handleReRecord}
        />
      )}

      {/* Live Transcript Display - Preserved across all states */}
      <LiveTranscript transcript={transcript} state={state} />

      {/* Loading Animation: "Analyzing your expense..." */}
      <AnimatePresence mode="wait">
        {state === 'Processing' && <ProcessingLoader key="loader" />}
      </AnimatePresence>

      {/* Populated Expense Review Card (Visible when extraction is Completed) */}
      <AnimatePresence mode="wait">
        {state === 'Completed' && expenseData && (
          <ExpenseReviewCard
            key="review-card"
            expense={expenseData}
            onUpdateExpense={(updated) => setExpenseData(updated)}
            onSaveExpense={handleSaveExpense}
            onReset={handleReset}
            onReRecord={handleReRecord}
            isSaving={isSaving}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
