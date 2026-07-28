import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { VoiceRecorder } from '../components/voice/VoiceRecorder';
import { Sparkles, Mic, Lightbulb } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

export const VoicePage: React.FC = () => {
  return (
    <PageContainer
      title="Voice Expense Recorder"
      subtitle="Speak naturally into your microphone. Our AI automatically extracts structured expense details."
      badge="Gemini AI Powered"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Main Voice Recorder Container */}
        <Card accentBorder className="p-6 sm:p-10 relative overflow-hidden">
          {/* Subtle Glow Accents */}
          <div className="absolute top-0 right-10 w-80 h-80 bg-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#22C55E]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="text-center space-y-2 max-w-lg mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ChatGPT-Style Voice Recording Experience</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F3F4F6] tracking-tight">
                AI Voice Expense Recorder
              </h2>
            </div>

            {/* Core Voice Recorder Component */}
            <VoiceRecorder />
          </div>
        </Card>

        {/* Helpful Spoken Examples Card */}
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
              Voice Prompts You Can Try
            </CardTitle>
            <CardDescription className="text-xs">
              Speak naturally using any currency, payment method, or relative date.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B0F14]/60 border border-slate-200/80 dark:border-[#222934]/60 space-y-1">
              <span className="font-bold text-[#3B82F6] flex items-center gap-1">
                <Mic className="w-3 h-3" /> Example 1:
              </span>
              <p className="text-slate-800 dark:text-[#F3F4F6] italic font-medium">
                "I spent 250 rupees on coffee at Starbucks today using UPI."
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B0F14]/60 border border-slate-200/80 dark:border-[#222934]/60 space-y-1">
              <span className="font-bold text-[#3B82F6] flex items-center gap-1">
                <Mic className="w-3 h-3" /> Example 2:
              </span>
              <p className="text-slate-800 dark:text-[#F3F4F6] italic font-medium">
                "Bought shoes from Nike yesterday for ₹4200."
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B0F14]/60 border border-slate-200/80 dark:border-[#222934]/60 space-y-1">
              <span className="font-bold text-[#3B82F6] flex items-center gap-1">
                <Mic className="w-3 h-3" /> Example 3:
              </span>
              <p className="text-slate-800 dark:text-[#F3F4F6] italic font-medium">
                "Paid ₹1850 for petrol at Shell station with my credit card."
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B0F14]/60 border border-slate-200/80 dark:border-[#222934]/60 space-y-1">
              <span className="font-bold text-[#3B82F6] flex items-center gap-1">
                <Mic className="w-3 h-3" /> Example 4:
              </span>
              <p className="text-slate-800 dark:text-[#F3F4F6] italic font-medium">
                "Purchased monthly groceries for 3500 rupees from DMart cash."
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
