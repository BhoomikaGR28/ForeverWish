'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Loader2 } from 'lucide-react';

type Mode = 'signin' | 'signup' | 'forgot';

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signin') {
        await signIn(email, password);
        toast.success('Welcome back! 💕');
        router.push('/dashboard');
      } else if (mode === 'signup') {
        await signUp(email, password, name);
        toast.success('Account created! Let\'s make some magic ✨');
        router.push('/dashboard');
      } else {
        await resetPassword(email);
        toast.success('Reset email sent! Check your inbox 📧');
        setMode('signin');
      }
    } catch (err: unknown) {
      const error = err as { code?: string };
      const messages: Record<string, string> = {
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/email-already-in-use': 'Email already in use',
        'auth/weak-password': 'Password must be at least 6 characters',
        'auth/invalid-email': 'Invalid email address',
      };
      toast.error(messages[error.code || ''] || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Signed in with Google! 🎉');
      router.push('/dashboard');
    } catch {
      toast.error('Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-rose-400 via-pink-400 to-purple-500 relative overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          {/* Floating elements */}
          {['💕', '🎂', '✨', '🌸', '💝', '🎊', '💫', '🎈'].map((e, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl"
              style={{
                top: `${10 + Math.random() * 80}%`,
                left: `${5 + i * 12}%`,
              }}
              animate={{ y: [-15, 15, -15], rotate: [-5, 5, -5] }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              {e}
            </motion.div>
          ))}

          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="text-8xl mb-6"
            >
              💝
            </motion.div>
            <h1 className="font-playfair text-4xl font-bold mb-4">
              ForeverWish
            </h1>
            <p className="text-white/80 text-lg font-dancing text-2xl">
              "Create wishes that last forever."
            </p>
            <div className="mt-8 space-y-3">
              {[
                '🎂 Beautiful birthday pages',
                '💕 Anniversary surprises',
                '✨ AI-powered wishes',
                '🔗 Share anywhere',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-white/90">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-rose-500 mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="mb-8">
                <div className="text-3xl mb-3">
                  {mode === 'signin' ? '👋' : mode === 'signup' ? '🎉' : '📧'}
                </div>
                <h2 className="font-playfair text-3xl font-bold text-gray-900">
                  {mode === 'signin'
                    ? 'Welcome back'
                    : mode === 'signup'
                    ? 'Create account'
                    : 'Reset password'}
                </h2>
                <p className="text-gray-500 mt-1">
                  {mode === 'signin'
                    ? 'Sign in to your ForeverWish account'
                    : mode === 'signup'
                    ? 'Start creating beautiful wish pages'
                    : 'Enter your email to reset your password'}
                </p>
              </div>

              {/* Google btn */}
              {mode !== 'forgot' && (
                <button
                  onClick={handleGoogle}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-rose-200 transition-all font-semibold text-gray-700 shadow-sm mb-6"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              )}

              {mode !== 'forgot' && (
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-gray-400 text-sm">or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      required
                      className="input-glass w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm"
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    required
                    className="input-glass w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm"
                  />
                </div>

                {mode !== 'forgot' && (
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      minLength={6}
                      className="input-glass w-full pl-11 pr-12 py-3.5 rounded-2xl text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                )}

                {mode === 'signin' && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-sm text-rose-500 hover:text-rose-600"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold shadow-lg shadow-rose-200 hover:shadow-rose-300 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:scale-100"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      {mode === 'signin' && '✨ Sign In'}
                      {mode === 'signup' && '🎉 Create Account'}
                      {mode === 'forgot' && '📧 Send Reset Email'}
                    </>
                  )}
                </button>
              </form>

              {/* Toggle mode */}
              <div className="text-center mt-6 text-sm text-gray-500">
                {mode === 'signin' ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      onClick={() => setMode('signup')}
                      className="text-rose-500 font-semibold hover:text-rose-600"
                    >
                      Sign Up Free
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      onClick={() => setMode('signin')}
                      className="text-rose-500 font-semibold hover:text-rose-600"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
