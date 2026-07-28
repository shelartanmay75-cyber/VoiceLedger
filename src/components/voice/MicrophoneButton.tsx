import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, RotateCcw } from 'lucide-react';
import type { RecordingState } from '../../types/voice';

export interface MicrophoneButtonProps {
  state: RecordingState;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onReRecord?: () => void;
  disabled?: boolean;
}

export const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({
  state,
  onStartRecording,
  onStopRecording,
  onReRecord,
  disabled = false,
}) => {
  const isListening = state === 'Listening';
  const isProcessing = state === 'Processing';

  const handleClick = () => {
    if (disabled || isProcessing) return;
    if (isListening) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-4 space-y-3">
      {/* Outer Animated Aura Pulsing Rings (Active during Listening) */}
      {isListening && (
        <>
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.6, 0.2] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#EF4444]/20 blur-xl pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.8, 0.3] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', delay: 0.3 }}
            className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-[#3B82F6]/30 blur-md pointer-events-none"
          />
        </>
      )}

      {/* Main Large Circular Microphone Button */}
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        onClick={handleClick}
        disabled={disabled || isProcessing}
        id="voice-mic-main-btn"
        className={`relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 shadow-2xl transition-all duration-300 flex items-center justify-center cursor-pointer group ${
          isListening
            ? 'bg-gradient-to-tr from-[#DC2626] via-[#EF4444] to-[#F87171] shadow-[0_0_50px_rgba(239,68,68,0.6)]'
            : 'bg-gradient-to-tr from-[#2563EB] via-[#3B82F6] to-[#60A5FA] shadow-[0_0_40px_rgba(59,130,246,0.4)]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={isListening ? 'Stop Recording' : 'Start Recording'}
      >
        <div
          className={`w-full h-full rounded-full flex items-center justify-center transition-colors ${
            isListening
              ? 'bg-[#151A21] group-hover:bg-[#1E293B]'
              : 'bg-[#0B0F14] group-hover:bg-[#151A21]'
          }`}
        >
          {isListening ? (
            <div className="flex flex-col items-center gap-1">
              <Square className="w-10 h-10 sm:w-12 sm:h-12 text-[#EF4444] fill-[#EF4444] animate-pulse" />
              <span className="text-[10px] font-extrabold text-[#EF4444] uppercase tracking-wider">
                Stop & Process
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Mic className="w-10 h-10 sm:w-12 sm:h-12 text-[#3B82F6] group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-extrabold text-[#3B82F6] uppercase tracking-wider">
                Tap Mic
              </span>
            </div>
          )}
        </div>
      </motion.button>

      {/* Re-record / Start Over Button while Listening */}
      {isListening && onReRecord && (
        <motion.button
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          type="button"
          onClick={onReRecord}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#151A21] hover:bg-slate-200 dark:hover:bg-[#222934] text-xs font-bold text-slate-700 dark:text-[#D1D5DB] border border-slate-200 dark:border-[#222934] shadow-sm transition-all cursor-pointer z-10"
          id="voice-mic-rerecord-btn"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#3B82F6]" />
          Re-record / Start Over
        </motion.button>
      )}
    </div>
  );
};
