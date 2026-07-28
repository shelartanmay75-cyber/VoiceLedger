import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { RecordingState, ExtractedExpense } from '../../types/voice';
import { extractExpenseWithGemini } from '../../services/geminiService';
import { MicrophoneButton } from './MicrophoneButton';
import { LiveTranscript } from './LiveTranscript';
import { RecordingStatus } from './RecordingStatus';
import { RecordingTimer } from './RecordingTimer';
import { ProcessingLoader } from './ProcessingLoader';
import { ExpenseReviewCard } from './ExpenseReviewCard';

// SpeechRecognition type declarations for browser support
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export interface VoiceRecorderProps {
  className?: string;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ className = '' }) => {
  const [state, setState] = useState<RecordingState>('Idle');
  const [transcript, setTranscript] = useState<string>('');
  const [expenseData, setExpenseData] = useState<ExtractedExpense | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    recognition.lang = 'en-IN'; // Optimized for English/Indian context (rupees, UPI, etc.)

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

    recognition.onend = () => {
      // If recognition stops while state is still Listening, handle completion or silence
    };

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
  };

  return (
    <div className={`w-full flex flex-col items-center space-y-6 ${className}`}>
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
        />
      )}

      {/* Live Transcript Display */}
      {(state === 'Idle' || state === 'Listening' || state === 'Processing') && (
        <LiveTranscript transcript={transcript} state={state} />
      )}

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
            onReset={handleReset}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
