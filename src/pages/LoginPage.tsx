import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, ShieldCheck, UserCheck, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';

export const LoginPage: React.FC = () => {
  const { user, isGuest, signInWithGoogle, signInAsGuest } = useAuth();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If user is already authenticated or guest, redirect to dashboard
  if (user || isGuest) {
    return <Navigate to="/" replace />;
  }

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setErrorMessage(null);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err: unknown) {
      console.error('Google Login Error:', err);
      setErrorMessage('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGuestLogin = () => {
    signInAsGuest();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#F3F4F6] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans selection:bg-[#3B82F6]/30 selection:text-[#3B82F6]">
      {/* Background Ambient Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#2563EB]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-md bg-[#151A21] border border-[#222934] rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative z-10 space-y-6"
      >
        {/* Header Section: Logo & Brand */}
        <div className="flex flex-col items-center text-center space-y-3">
          {/* Logo Badge */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2563EB] via-[#3B82F6] to-[#60A5FA] p-0.5 shadow-[0_0_30px_rgba(59,130,246,0.4)] flex items-center justify-center">
            <div className="w-full h-full bg-[#0B0F14] rounded-[14px] flex items-center justify-center">
              <Mic className="w-7 h-7 text-[#3B82F6]" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-1">
            <span className="font-extrabold text-xl text-[#F3F4F6] tracking-tight">
              VoiceLedger
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30 uppercase tracking-wider">
              AI
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F3F4F6] tracking-tight leading-tight pt-1">
            Track your expenses with your voice.
          </h1>

          <p className="text-xs sm:text-sm text-[#9CA3AF] max-w-xs leading-relaxed">
            Record, categorize, and understand your personal finances through natural speech.
          </p>
        </div>

        {/* Action Buttons Section */}
        <div className="space-y-3 pt-2">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#EF4444] text-center font-medium">
              {errorMessage}
            </div>
          )}

          {/* Continue with Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            id="google-login-btn"
            className="w-full bg-[#F3F4F6] hover:bg-white text-[#0B0F14] font-semibold text-sm py-3.5 px-4 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
          >
            {/* Google Icon SVG */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isLoggingIn ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          {/* Continue as Guest Button */}
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={handleGuestLogin}
            id="guest-login-btn"
            leftIcon={<UserCheck className="w-4 h-4 text-[#3B82F6]" />}
            rightIcon={<ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />}
            className="border-[#222934] text-[#F3F4F6] hover:border-[#3B82F6]/40 hover:bg-[#1C222C]"
          >
            Continue as Guest
          </Button>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#222934]/60 text-[11px] text-[#9CA3AF]">
          <div className="flex items-center gap-1.5 justify-center py-1 bg-[#0B0F14]/50 rounded-lg border border-[#222934]/40">
            <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>Secure Auth</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center py-1 bg-[#0B0F14]/50 rounded-lg border border-[#222934]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Instant Access</span>
          </div>
        </div>

        {/* Small Privacy Note */}
        <div className="text-center pt-1">
          <p className="text-[11px] text-[#6B7280] leading-relaxed">
            By continuing, you agree to VoiceLedger's Privacy Policy and Terms of Service. We respect your financial data privacy.
          </p>
        </div>
      </motion.div>

      {/* Footer copyright note */}
      <div className="mt-8 text-center text-xs text-[#6B7280]">
        VoiceLedger © {new Date().getFullYear()} — AI Voice Expense Tracker
      </div>
    </div>
  );
};
