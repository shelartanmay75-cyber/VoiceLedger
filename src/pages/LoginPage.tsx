import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  ShieldCheck,
  UserCheck,
  Sparkles,
  ArrowRight,
  BarChart3,
  Target,
  Plane,
  Users,
  CalendarClock,
  Sun,
  Moon,
  CheckCircle2,
  Zap,
  Volume2,
  LogIn,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Button } from '../components/ui/Button';

export const LoginPage: React.FC = () => {
  const { user, isGuest, signInWithGoogle, signInAsGuest } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'showcase' | 'login'>('showcase');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeVoiceTab, setActiveVoiceTab] = useState<'speak' | 'parse' | 'saved'>('parse');

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col relative overflow-x-hidden font-sans selection:bg-[#3B82F6]/30 selection:text-[#3B82F6] transition-colors duration-200">
      {/* Background Ambient Glow Lights */}
      <div className="fixed top-0 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#3B82F6]/10 dark:bg-[#3B82F6]/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/4 translate-y-1/2 w-[500px] h-[500px] bg-[#8B5CF6]/10 rounded-full blur-[140px] pointer-events-none z-0" />

      <AnimatePresence mode="wait">
        {/* ======================================================================= */}
        {/* VIEW 1: DEDICATED GOOGLE LOGIN PAGE CARD (when Get Started / Login clicked) */}
        {/* ======================================================================= */}
        {viewMode === 'login' ? (
          <motion.div
            key="login-screen"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10 my-auto"
          >
            {/* Top Bar with Back Button */}
            <div className="w-full max-w-md flex items-center justify-between mb-6">
              <button
                onClick={() => setViewMode('showcase')}
                className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-900 transition-colors"
                id="login-card-back-btn"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Overview</span>
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-all"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-[#FACC15]" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
              </button>
            </div>

            {/* Main Login Card */}
            <div className="w-full max-w-md bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6 backdrop-blur-xl">
              {/* Header Section: Logo & Brand */}
              <div className="flex flex-col items-center text-center space-y-3">
                {/* Logo Badge */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2563EB] via-[#3B82F6] to-[#60A5FA] p-0.5 shadow-[0_0_30px_rgba(59,130,246,0.4)] flex items-center justify-center">
                  <div className="w-full h-full bg-white dark:bg-[#0B0F14] rounded-[14px] flex items-center justify-center">
                    <Mic className="w-7 h-7 text-[#3B82F6]" />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-1">
                  <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
                    VoiceLedger
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#3B82F6]/10 text-[#2563EB] dark:text-[#60A5FA] border border-[#3B82F6]/30 uppercase tracking-wider">
                    AI
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight pt-1">
                  Track your expenses with your voice.
                </h1>

                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                  Record, categorize, and understand your personal finances through natural speech in Rupees (₹).
                </p>
              </div>

              {/* Action Buttons Section */}
              <div className="space-y-3 pt-2">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-500 dark:text-red-400 text-center font-medium">
                    {errorMessage}
                  </div>
                )}

                {/* Continue with Google Button */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                  id="google-login-btn"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 font-semibold text-sm py-3.5 px-4 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
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
                  className="border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200"
                  leftIcon={<UserCheck className="w-4 h-4 text-[#3B82F6]" />}
                  rightIcon={<ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />}
                >
                  Continue as Guest
                </Button>
              </div>

              {/* Feature Badges */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5 justify-center py-1 bg-slate-50 dark:bg-slate-950/50 rounded-lg border border-slate-200/80 dark:border-slate-800/40">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span>Secure Auth</span>
                </div>
                <div className="flex items-center gap-1.5 justify-center py-1 bg-slate-50 dark:bg-slate-950/50 rounded-lg border border-slate-200/80 dark:border-slate-800/40">
                  <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>Instant Access</span>
                </div>
              </div>

              {/* Small Privacy Note */}
              <div className="text-center pt-1">
                <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
                  By continuing, you agree to VoiceLedger's Privacy Policy and Terms of Service. We respect your financial data privacy.
                </p>
              </div>
            </div>

            {/* Footer copyright note */}
            <div className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
              VoiceLedger © {new Date().getFullYear()} — AI Voice Expense Tracker
            </div>
          </motion.div>
        ) : (

          /* ======================================================================= */
          /* VIEW 2: FULL LANDING SHOWCASE PAGE (Website Name, Slogan, Info & Features) */
          /* ======================================================================= */
          <motion.div
            key="showcase-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col"
          >
            {/* TOP HEADER / NAVBAR */}
            <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors">
              {/* Top-Left Section: Logo + Get Started & Login Buttons */}
              <div className="flex items-center gap-3 sm:gap-6">
                {/* Logo & Brand */}
                <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2563EB] via-[#3B82F6] to-[#60A5FA] p-0.5 shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center justify-center">
                    <div className="w-full h-full bg-white dark:bg-[#0B0F14] rounded-[10px] flex items-center justify-center">
                      <Mic className="w-4 h-4 text-[#3B82F6]" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white font-sans">
                      VoiceLedger
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20 text-[#2563EB] dark:text-[#60A5FA] border border-[#3B82F6]/30 dark:border-[#3B82F6]/40 uppercase tracking-wider">
                      AI
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-[1px] h-6 bg-slate-200 dark:bg-slate-800" />

                {/* Top Left Action Buttons: Get Started & Login */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('login')}
                    id="top-left-get-started-btn"
                    className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Get Started</span>
                  </button>

                  <button
                    onClick={() => setViewMode('login')}
                    id="top-left-login-btn"
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white border border-slate-200 dark:border-slate-700/80 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#3B82F6]" />
                    <span>Login</span>
                  </button>
                </div>
              </div>

              {/* Top-Right Section: Guest & Theme Toggle */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={handleGuestLogin}
                  id="top-right-guest-btn"
                  className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#FACC15]" />
                  <span>Try Guest Demo</span>
                </button>

                <button
                  onClick={toggleTheme}
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-all"
                  title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                  id="landing-theme-toggle-btn"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-[#FACC15]" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-700" />
                  )}
                </button>
              </div>
            </header>

            {/* HERO SECTION */}
            <section className="relative z-10 px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24 max-w-7xl mx-auto text-center flex flex-col items-center">
              {/* Top Tagline Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#2563EB] dark:text-[#60A5FA] text-xs font-semibold mb-6 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#3B82F6] dark:text-[#60A5FA]" />
                <span>Next-Generation Voice AI Expense Management</span>
              </motion.div>

              {/* Website Name & Slogan */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl leading-[1.1] mb-4"
              >
                Speak Your Expenses. <br />
                <span className="bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#60A5FA] dark:from-[#60A5FA] dark:via-[#3B82F6] dark:to-[#93C5FD] bg-clip-text text-transparent">
                  Master Your Wealth.
                </span>
              </motion.h1>

              {/* Subtitle / Description */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed mb-8"
              >
                VoiceLedger transforms natural spoken sentences into structured expense logs, real-time spending insights, multi-person trip budgets, and automated subscription tracking in Rupees (₹).
              </motion.p>

              {/* Main CTA Action Bar */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md"
              >
                {/* Primary Get Started Button (Opens Google Login Page) */}
                <button
                  onClick={() => setViewMode('login')}
                  id="hero-get-started-btn"
                  className="w-full sm:w-auto flex-1 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white font-bold text-sm py-3.5 px-6 rounded-2xl shadow-xl transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Get Started with Google</span>
                </button>

                {/* Secondary Guest Button */}
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleGuestLogin}
                  id="hero-guest-login-btn"
                  className="w-full sm:w-auto border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white rounded-2xl py-3.5 px-5"
                  leftIcon={<UserCheck className="w-4 h-4 text-[#FACC15]" />}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Guest Demo
                </Button>
              </motion.div>

              {/* Feature Badges */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                  <span>Zero Setup Required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />
                  <span>Google Secure OAuth</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#FACC15]" />
                  <span>Instant Voice Parsing (₹)</span>
                </div>
              </div>

              {/* INTERACTIVE VOICE DEMO MOCKUP */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-14 w-full max-w-4xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.7)] text-left relative overflow-hidden backdrop-blur-2xl transition-colors"
              >
                {/* Mockup Header */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="ml-2 text-xs font-mono text-slate-500 dark:text-slate-400">voiceledger-engine.ai</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      Live AI Assistant Active
                    </span>
                  </div>
                </div>

                {/* Interactive Voice Display */}
                <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Mic Pulse Graphic */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 text-center">
                    <div className="relative group cursor-pointer" onClick={() => setActiveVoiceTab(activeVoiceTab === 'speak' ? 'parse' : 'speak')}>
                      <div className="absolute -inset-3 rounded-full bg-[#3B82F6]/30 blur-md animate-pulse" />
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#3B82F6] flex items-center justify-center relative z-10 shadow-lg shadow-blue-500/30">
                        <Mic className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Animated Sound Wave lines */}
                    <div className="flex items-center justify-center gap-1 mt-4 h-6">
                      {[40, 75, 100, 60, 90, 45, 80, 50].map((h, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: ['20%', `${h}%`, '20%'] }}
                          transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.15 }}
                          className="w-1 bg-[#3B82F6] rounded-full"
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">Listening to Voice...</span>
                  </div>

                  {/* AI Extracted Result Preview Card */}
                  <div className="md:col-span-8 space-y-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                      <Volume2 className="w-5 h-5 text-[#2563EB] dark:text-[#60A5FA] shrink-0" />
                      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 italic font-mono">
                        "Paid ₹425 for dinner with Alex at Bistro 9"
                      </p>
                    </div>

                    {/* Extracted JSON Card */}
                    <div className="p-4 rounded-2xl bg-[#3B82F6]/5 dark:bg-[#3B82F6]/10 border border-[#3B82F6]/20 dark:border-[#3B82F6]/30 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA]">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" /> AI Parsed Transaction
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                          100% Confidence
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                        <div className="bg-white dark:bg-slate-950/60 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800/60">
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">Amount</div>
                          <div className="font-bold text-slate-900 dark:text-white text-sm">₹425</div>
                        </div>
                        <div className="bg-white dark:bg-slate-950/60 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800/60">
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">Category</div>
                          <div className="font-semibold text-amber-600 dark:text-amber-400">Dining Out</div>
                        </div>
                        <div className="bg-white dark:bg-slate-950/60 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800/60">
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">Merchant</div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">Bistro 9</div>
                        </div>
                        <div className="bg-white dark:bg-slate-950/60 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800/60">
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">Tag</div>
                          <div className="font-semibold text-blue-600 dark:text-blue-400">Shared Expense</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* WEBSITE FEATURES SECTION */}
            <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800/80">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Everything You Need to Master Your Money
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3">
                  VoiceLedger combines voice recognition AI with comprehensive wealth tracking tools in Rupees (₹).
                </p>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Feature 1: Voice AI */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-[#3B82F6]/50 transition-all duration-300 hover:-translate-y-1 shadow-sm dark:shadow-none group">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Mic className="w-6 h-6 text-[#2563EB] dark:text-[#60A5FA]" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Natural Voice Recognition</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Log transactions hands-free on the go. State amounts in Rupees, descriptions, and merchants naturally—AI handles category assignment instantly.
                  </p>
                </div>

                {/* Feature 2: Smart Analytics */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-[#3B82F6]/50 transition-all duration-300 hover:-translate-y-1 shadow-sm dark:shadow-none group">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Real-Time Visual Analytics</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Explore breakdown pie charts, monthly spending trajectories, category averages, and cash flow diagnostics effortlessly.
                  </p>
                </div>

                {/* Feature 3: Shared Expenses */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-[#3B82F6]/50 transition-all duration-300 hover:-translate-y-1 shadow-sm dark:shadow-none group">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Shared Expenses & Splitting</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Manage roommate bills, dinner tabs, or partner budgets with clear owed balance calculations in ₹ and settlement tracking.
                  </p>
                </div>

                {/* Feature 4: Trip Management */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-[#3B82F6]/50 transition-all duration-300 hover:-translate-y-1 shadow-sm dark:shadow-none group">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Plane className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Trip & Travel Budgets</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Organize multi-currency travel folders for vacations, track flight costs, hotel stays, and group activities seamlessly.
                  </p>
                </div>

                {/* Feature 5: Savings Goals */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-[#3B82F6]/50 transition-all duration-300 hover:-translate-y-1 shadow-sm dark:shadow-none group">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Target className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Target Savings Goals</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Set financial milestones for emergency funds, new purchases, or investments with progress bars and contribution history.
                  </p>
                </div>

                {/* Feature 6: Subscriptions Tracker */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-[#3B82F6]/50 transition-all duration-300 hover:-translate-y-1 shadow-sm dark:shadow-none group">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <CalendarClock className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Subscription Management</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Track recurring monthly SaaS, streaming services, and bills with renewal reminders to prevent unwanted charges.
                  </p>
                </div>
              </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800/80 text-center">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-12">
                Three Simple Steps to Financial Clarity
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20 text-[#2563EB] dark:text-[#60A5FA] font-extrabold text-lg flex items-center justify-center mb-4">
                    1
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Tap & Speak</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Press the mic button and state your purchase naturally, e.g. "Coffee for ₹150".
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20 text-[#2563EB] dark:text-[#60A5FA] font-extrabold text-lg flex items-center justify-center mb-4">
                    2
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">AI Extraction</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    VoiceLedger parses amount, category, date, and merchant automatically within milliseconds.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20 text-[#2563EB] dark:text-[#60A5FA] font-extrabold text-lg flex items-center justify-center mb-4">
                    3
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Track & Grow</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Watch your balances, budget goals, and monthly analytics update seamlessly in Rupees.
                  </p>
                </div>
              </div>
            </section>

            {/* CALL TO ACTION BOTTOM BANNER */}
            <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
              <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-blue-50/80 via-white to-slate-100 dark:from-[#1E3A8A]/50 dark:via-slate-900 dark:to-slate-950 border border-blue-200 dark:border-blue-500/30 shadow-xl dark:shadow-[0_20px_50px_rgba(59,130,246,0.15)] flex flex-col items-center">
                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                  Ready to control your expenses effortlessly?
                </h2>
                <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 max-w-lg mb-8">
                  Join VoiceLedger today and experience hands-free financial intelligence.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm">
                  <button
                    onClick={() => setViewMode('login')}
                    id="bottom-cta-get-started-btn"
                    className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Get Started Now</span>
                  </button>
                  <button
                    onClick={() => setViewMode('login')}
                    id="bottom-cta-login-btn"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold text-sm py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4 text-[#3B82F6]" />
                    <span>Login with Google</span>
                  </button>
                </div>
              </div>
            </section>

            {/* FOOTER */}
            <footer className="relative z-10 py-8 px-4 sm:px-8 border-t border-slate-200 dark:border-slate-800/80 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto w-full">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#3B82F6] p-0.5 flex items-center justify-center">
                  <Mic className="w-3 h-3 text-white" />
                </div>
                <span className="font-bold text-slate-900 dark:text-white">VoiceLedger AI</span>
                <span>— Speak Your Expenses. Master Your Wealth.</span>
              </div>

              <div className="flex items-center gap-4">
                <button onClick={() => setViewMode('login')} className="hover:text-slate-900 dark:hover:text-white transition-colors">Get Started</button>
                <button onClick={() => setViewMode('login')} className="hover:text-slate-900 dark:hover:text-white transition-colors">Login</button>
                <button onClick={handleGuestLogin} className="hover:text-slate-900 dark:hover:text-white transition-colors">Guest Mode</button>
              </div>

              <div>
                VoiceLedger © {new Date().getFullYear()} — All rights reserved.
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
