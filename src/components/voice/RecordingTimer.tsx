import React from 'react';
import { Timer } from 'lucide-react';

export interface RecordingTimerProps {
  seconds: number;
  isListening: boolean;
}

export const RecordingTimer: React.FC<RecordingTimerProps> = ({ seconds, isListening }) => {
  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(mins)}:${pad(secs)}`;
  };

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#151A21] border border-slate-200 dark:border-[#222934] text-xs font-mono font-bold text-slate-700 dark:text-[#D1D5DB]">
      <Timer className={`w-3.5 h-3.5 ${isListening ? 'text-[#EF4444] animate-spin' : 'text-[#3B82F6]'}`} />
      <span>{formatTime(seconds)}</span>
      {isListening && <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />}
    </div>
  );
};
