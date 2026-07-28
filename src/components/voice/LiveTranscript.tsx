import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquareText, Mic } from 'lucide-react';
import type { RecordingState } from '../../types/voice';

export interface LiveTranscriptProps {
  transcript: string;
  state: RecordingState;
}

export const LiveTranscript: React.FC<LiveTranscriptProps> = ({ transcript, state }) => {
  const isListening = state === 'Listening';

  return (
    <div className="w-full max-w-xl mx-auto space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-slate-500 dark:text-[#9CA3AF] uppercase tracking-wider flex items-center gap-1.5">
          <MessageSquareText className="w-3.5 h-3.5 text-[#3B82F6]" />
          Live Transcript
        </span>
        {isListening && (
          <span className="text-[10px] font-bold text-[#EF4444] bg-[#EF4444]/10 px-2 py-0.5 rounded-full border border-[#EF4444]/30 animate-pulse flex items-center gap-1">
            <Mic className="w-2.5 h-2.5" /> Recording...
          </span>
        )}
      </div>

      <motion.div
        layout
        className={`w-full min-h-[90px] p-4 rounded-2xl border transition-all duration-300 flex items-center ${
          isListening
            ? 'bg-[#3B82F6]/5 dark:bg-[#3B82F6]/10 border-[#3B82F6]/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
            : 'bg-slate-50 dark:bg-[#0B0F14] border-slate-200 dark:border-[#222934]'
        }`}
      >
        {transcript ? (
          <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-[#F3F4F6] italic leading-relaxed w-full">
            "{transcript}"
          </p>
        ) : (
          <div className="text-center w-full space-y-1">
            <p className="text-xs sm:text-sm text-slate-400 dark:text-[#6B7280]">
              {isListening
                ? 'Listening... Start speaking naturally now...'
                : 'Press the microphone button and speak (e.g. "I spent ₹250 on coffee at Starbucks using UPI")'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
