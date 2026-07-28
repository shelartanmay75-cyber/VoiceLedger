import React from 'react';
import {
  Mic,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  WifiOff,
  ShieldAlert,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import type { RecordingState } from '../../types/voice';
import { Button } from '../ui/Button';

export interface RecordingStatusProps {
  state: RecordingState;
  errorMessage?: string | null;
  onRetry?: () => void;
}

export const RecordingStatus: React.FC<RecordingStatusProps> = ({
  state,
  errorMessage,
  onRetry,
}) => {
  switch (state) {
    case 'Listening':
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 animate-pulse">
          <Mic className="w-3.5 h-3.5" />
          <span>Listening to your voice...</span>
        </div>
      );

    case 'Processing':
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>Analyzing your expense...</span>
        </div>
      );

    case 'Completed':
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Expense Structured Successfully</span>
        </div>
      );

    case 'Permission Denied':
      return (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 max-w-md mx-auto space-y-2 text-center">
          <div className="flex items-center justify-center gap-2 font-bold text-sm">
            <ShieldAlert className="w-4 h-4" />
            Microphone Permission Denied
          </div>
          <p className="text-xs text-amber-400">
            {errorMessage ||
              'Please allow microphone access in your browser settings to record your voice.'}
          </p>
          {onRetry && (
            <div className="pt-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={onRetry}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                className="border-amber-500/40 text-amber-400 hover:bg-amber-500/20"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      );

    case 'Network Error':
      return (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 max-w-md mx-auto space-y-2 text-center">
          <div className="flex items-center justify-center gap-2 font-bold text-sm">
            <WifiOff className="w-4 h-4" />
            Network Failure
          </div>
          <p className="text-xs text-rose-400">
            {errorMessage || 'Unable to connect to AI extraction engine. Please check your network connection.'}
          </p>
          {onRetry && (
            <div className="pt-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={onRetry}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                className="border-rose-500/40 text-rose-400 hover:bg-rose-500/20"
              >
                Retry Request
              </Button>
            </div>
          )}
        </div>
      );

    case 'Browser Unsupported':
      return (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 max-w-md mx-auto space-y-2 text-center">
          <div className="flex items-center justify-center gap-2 font-bold text-sm">
            <HelpCircle className="w-4 h-4" />
            Browser Speech API Unsupported
          </div>
          <p className="text-xs text-rose-400">
            Speech Recognition is not supported in this browser. Please use Chrome, Edge, or Safari.
          </p>
        </div>
      );

    case 'Error':
      return (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 max-w-md mx-auto space-y-2 text-center">
          <div className="flex items-center justify-center gap-2 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            Recording Error
          </div>
          <p className="text-xs text-rose-400">
            {errorMessage || 'Something went wrong while capturing your expense. Please try speaking again.'}
          </p>
          {onRetry && (
            <div className="pt-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={onRetry}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                className="border-rose-500/40 text-rose-400 hover:bg-rose-500/20"
              >
                Retry
              </Button>
            </div>
          )}
        </div>
      );

    case 'Idle':
    default:
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-[#151A21] text-slate-500 dark:text-[#9CA3AF] border border-slate-200 dark:border-[#222934]">
          <Mic className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span>Ready to record voice expense</span>
        </div>
      );
  }
};
