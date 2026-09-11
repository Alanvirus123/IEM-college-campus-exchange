'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, Phone, Lock, User as UserIcon, GraduationCap, Sparkles, ArrowRight, ShieldCheck, CheckCircle, RefreshCw, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, authMode, setAuthMode, signIn, signUp, sendOtp, verifyOtp } = useAuth();

  // Registration step: 'details' -> 'otp' -> 'verified'
  const [step, setStep] = useState<'details' | 'otp' | 'verified'>('details');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [major, setMajor] = useState('');
  const [year, setYear] = useState('Junior (3rd Year)');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  
  // OTP states
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [simulatedHint, setSimulatedHint] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: any = null;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!authModalOpen) return null;

  const resetOtpFlow = () => {
    setStep('details');
    setOtpDigits(['', '', '', '', '', '']);
    setTimer(60);
    setCanResend(false);
    setError(null);
    setSimulatedHint(null);
  };

  // Step 1: Send OTP to Phone
  const handleInitiateSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    const res = await sendOtp(phone);
    setLoading(false);

    if (res.success) {
      setStep('otp');
      setTimer(60);
      setCanResend(false);
      if (res.simulatedOtp) {
        setSimulatedHint(res.simulatedOtp);
      }
      setTimeout(() => inputRefs.current[0]?.focus(), 150);
    } else {
      setError(res.error || 'Failed to send OTP. Please try again.');
    }
  };

  // Handle digit input in the 6-box OTP component
  const handleDigitChange = (index: number, val: string) => {
    if (val.length > 1) {
      // User pasted full OTP
      const pasted = val.replace(/[^0-9]/g, '').slice(0, 6);
      if (pasted.length > 0) {
        const newDigits = [...otpDigits];
        for (let i = 0; i < 6; i++) {
          newDigits[i] = pasted[i] || '';
        }
        setOtpDigits(newDigits);
        const nextFocus = Math.min(pasted.length, 5);
        inputRefs.current[nextFocus]?.focus();
      }
      return;
    }

    const clean = val.replace(/[^0-9]/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = clean;
    setOtpDigits(newDigits);

    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const fullOtp = otpDigits.join('');
    if (fullOtp.length < 6) {
      setError('Please enter the full 6-digit OTP code.');
      return;
    }

    setLoading(true);
    const verifyRes = await verifyOtp(phone, fullOtp);

    if (!verifyRes.verified) {
      setLoading(false);
      setError(verifyRes.error || 'Invalid OTP code. Please verify and try again.');
      return;
    }

    // Step 3: Complete Account Registration
    const signUpRes = await signUp({
      name,
      email,
      phone,
      password,
      major,
      year,
      phoneVerified: true
    });

    setLoading(false);
    if (signUpRes.success) {
      setStep('verified');
      setTimeout(() => {
        setAuthModalOpen(false);
        resetOtpFlow();
      }, 1500);
    } else {
      setError(signUpRes.error || 'Failed to complete registration.');
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setError(null);
    setLoading(true);

    const res = await sendOtp(phone);
    setLoading(false);

    if (res.success) {
      setTimer(60);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      if (res.simulatedOtp) {
        setSimulatedHint(res.simulatedOtp);
      }
      inputRefs.current[0]?.focus();
    } else {
      setError(res.error || 'Failed to resend OTP.');
    }
  };

  // Quick Sign In
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn({
      emailOrPhone,
      password
    });

    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Sign in failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-[#18191e] rounded-3xl shadow-2xl border border-gray-200/80 dark:border-zinc-800 overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => { setAuthModalOpen(false); resetOtpFlow(); }}
          className="absolute top-4 right-4 z-20 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-gray-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-gray-900 dark:text-white">UniLoop Campus Pass</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            Direct buyer & seller verified student access with SMS OTP authentication.
          </p>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1 bg-gray-100 dark:bg-zinc-800 rounded-xl mt-4">
            <button
              type="button"
              onClick={() => { setAuthMode('signin'); resetOtpFlow(); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                authMode === 'signin'
                  ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('signup'); resetOtpFlow(); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                authMode === 'signup'
                  ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900'
              }`}
            >
              Register & Verify Phone
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-600 dark:text-red-400 font-medium">
              {error}
            </div>
          )}

          {authMode === 'signin' ? (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wide mb-1.5">
                  Email or Phone Number *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="e.g. alex@campus.edu or 9876543210"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-900 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wide mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (optional for demo)"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-900 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Signing in...' : 'Sign In to Campus Exchange'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            /* Sign Up Flow: Step 1 Details -> Step 2 OTP -> Step 3 Verified */
            <div>
              {step === 'details' && (
                <form onSubmit={handleInitiateSignUp} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wide mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rohan Sharma"
                        className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wide mb-1">
                      University / Personal Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="rohan@campus.edu or rohan@gmail.com"
                        className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wide mb-1">
                      Mobile Number for SMS OTP *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs font-bold text-gray-500">+91</span>
                      <input
                        type="tel"
                        required
                        value={phone.replace('+91', '').trim()}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98765 43210"
                        className="w-full pl-12 pr-4 py-2 text-sm bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 outline-none"
                      />
                    </div>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 mt-1 block font-medium">
                      📲 A 6-digit SMS OTP code will be sent to verify your phone number.
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wide mb-1">
                        Major / Branch
                      </label>
                      <input
                        type="text"
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        placeholder="e.g. Mechanical"
                        className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wide mb-1">
                        Year
                      </label>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 outline-none"
                      >
                        <option value="Freshman (1st Year)">1st Year</option>
                        <option value="Sophomore (2nd Year)">2nd Year</option>
                        <option value="Junior (3rd Year)">3rd Year</option>
                        <option value="Senior (4th Year)">4th Year</option>
                        <option value="Graduate Student">Grad Student</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wide mb-1">
                      Password (Optional)
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{loading ? 'Sending SMS OTP...' : 'Send SMS OTP Verification Code'}</span>
                    </button>
                  </div>
                </form>
              )}

              {step === 'otp' && (
                <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                    <KeyRound className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">Verify Your Phone Number</h3>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                      Enter the 6-digit SMS code sent to <strong className="text-gray-800 dark:text-zinc-200">{phone}</strong>
                    </p>
                  </div>

                  {simulatedHint && (
                    <div className="p-2.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300 font-mono">
                      ⚡ Demo/Sandbox Code: <strong>{simulatedHint}</strong> (or use <strong>123456</strong>)
                    </div>
                  )}

                  {/* 6 Individual Digit Inputs with auto-focus */}
                  <div className="flex justify-center gap-2 py-2">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => { inputRefs.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={digit}
                        onChange={(e) => handleDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        className="w-11 h-12 text-center text-lg font-black bg-gray-50 dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-600 focus:bg-white dark:focus:bg-zinc-900 outline-none transition-all"
                      />
                    ))}
                  </div>

                  {/* Timer & Resend Button */}
                  <div className="flex items-center justify-between text-xs px-2">
                    <button
                      type="button"
                      onClick={resetOtpFlow}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-zinc-300 underline"
                    >
                      Change Number
                    </button>

                    <div>
                      {canResend ? (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={loading}
                          className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Resend Code</span>
                        </button>
                      ) : (
                        <span className="text-gray-400 font-mono">Resend in 0:{timer < 10 ? '0' + timer : timer}</span>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpDigits.join('').length < 6}
                    className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>{loading ? 'Verifying Code...' : 'Verify Phone & Complete Registration'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {step === 'verified' && (
                <div className="py-8 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Phone Verified Successfully!</h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">
                    Welcome to UniLoop, {name.split(' ')[0]}! You can now contact buyers & sellers directly.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
