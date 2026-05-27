'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { createProject, updateProject, getProject, publishProject } from '@/lib/db';
import { WishProject, WishCategory, WishTheme } from '@/types';
import { CATEGORIES, THEMES, AI_WISH_STYLES } from '@/lib/constants';
import { getTheme } from '@/lib/utils';
import toast from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Loader2,
  Check,
  RefreshCw,
  Globe,
} from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Occasion', emoji: '🎯' },
  { id: 2, title: 'Details',  emoji: '✍️' },
  { id: 3, title: 'Message',  emoji: '💬' },
  { id: 4, title: 'Theme',    emoji: '🎨' },
  { id: 5, title: 'Publish',  emoji: '🚀' },
];

export default function CreatePageInner() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(editId);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedAiStyle, setSelectedAiStyle] = useState('romantic');

  const [category, setCategory] = useState<WishCategory>('birthday');
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [countdownDate, setCountdownDate] = useState('');
  const [message, setMessage] = useState('');
  const [theme, setTheme] = useState<WishTheme>('rose-garden');

  useEffect(() => {
    if (!loading && !user) router.push('/auth');
  }, [user, loading, router]);

  useEffect(() => {
    if (editId) {
      getProject(editId).then((p) => {
        if (p) {
          setCategory(p.category);
          setRecipientName(p.recipientName);
          setSenderName(p.senderName);
          setMessage(p.message);
          setTheme(p.theme);
          setCountdownDate(p.countdownDate || '');
        }
      });
    }
  }, [editId]);

  const handleAIGenerate = async () => {
    if (!recipientName || !senderName) {
      toast.error('Please add recipient and sender names first');
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch('/api/generate-wish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientName, senderName, style: selectedAiStyle, category }),
      });
      const data = await res.json();
      setMessage(data.wish);
      toast.success('AI wish generated! ✨');
    } catch {
      toast.error('AI generation failed, try again');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveAndPublish = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const data: Partial<WishProject> = {
        category,
        recipientName,
        senderName,
        message,
        theme,
        countdownDate: countdownDate || null,
        photos: [],
        videos: [],
        voiceNotes: [],
        backgroundMusic: null,
        timeline: [],
        customFont: 'playfair',
        primaryColor: getTheme(theme).primaryColor,
        isPasswordProtected: false,
      };

      let id = projectId;
      if (id) {
        await updateProject(id, data);
      } else {
        id = await createProject(user.uid, data);
        setProjectId(id);
      }

      await publishProject(id!);
      const saved = await getProject(id!);
      toast.success('Your wish is live! 🎉');
      router.push(`/wish/${saved?.slug}`);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return !!category;
    if (step === 2) return !!recipientName && !!senderName;
    if (step === 3) return message.length >= 10;
    if (step === 4) return !!theme;
    return true;
  };

  const selectedTheme = getTheme(theme);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      scale: step === s.id ? 1.1 : 1,
                      backgroundColor: step >= s.id ? '#f43f5e' : '#e5e7eb',
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm"
                    style={{ color: step >= s.id ? 'white' : '#9ca3af' }}
                  >
                    {step > s.id ? <Check size={16} /> : s.emoji}
                  </motion.div>
                  <span className="text-xs text-gray-400 mt-1 hidden sm:block">{s.title}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full"
                      animate={{ width: step > s.id ? '100%' : '0%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-sm border border-pink-100 p-6 sm:p-8"
          >

            {/* Step 1: Category */}
            {step === 1 && (
              <div>
                <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-2">What's the occasion? 🎯</h2>
                <p className="text-gray-400 text-sm mb-8">Choose the type of wish you want to create</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {CATEGORIES.map((cat) => (
                    <motion.button
                      key={cat.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setCategory(cat.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        category === cat.id
                          ? 'border-rose-400 bg-rose-50 shadow-sm'
                          : 'border-gray-100 hover:border-rose-200'
                      }`}
                    >
                      <div className="text-2xl mb-2">{cat.emoji}</div>
                      <div className="font-semibold text-gray-800 text-sm">{cat.label}</div>
                      <div className="text-gray-400 text-xs mt-1">{cat.desc}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div>
                <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-2">Tell us the details ✍️</h2>
                <p className="text-gray-400 text-sm mb-8">Who is this wish for?</p>
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Recipient's Name *</label>
                    <input
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g., Priya, Arjun, Mom..."
                      className="input-glass w-full px-4 py-3 rounded-2xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Your Name *</label>
                    <input
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Your name or nickname"
                      className="input-glass w-full px-4 py-3 rounded-2xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Countdown Date (optional)</label>
                    <input
                      type="datetime-local"
                      value={countdownDate}
                      onChange={(e) => setCountdownDate(e.target.value)}
                      className="input-glass w-full px-4 py-3 rounded-2xl text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-1">Add a countdown timer to build anticipation</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Message */}
            {step === 3 && (
              <div>
                <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-2">Write your message 💬</h2>
                <p className="text-gray-400 text-sm mb-6">Pour your heart into these words</p>

                {/* AI Generator */}
                <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-2xl p-5 mb-6 border border-violet-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={18} className="text-violet-500" />
                    <span className="font-semibold text-gray-800 text-sm">AI Wish Generator</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                    {AI_WISH_STYLES.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedAiStyle(style.id)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                          selectedAiStyle === style.id
                            ? 'bg-violet-500 text-white'
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-violet-300'
                        }`}
                      >
                        {style.emoji} {style.name}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleAIGenerate}
                    disabled={aiLoading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-70"
                  >
                    {aiLoading ? <Loader2 size={16} className="animate-spin" /> : <><Sparkles size={16} />Generate AI Wish</>}
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-gray-700">Your Message *</label>
                    {message && (
                      <button onClick={() => setMessage('')} className="text-xs text-gray-400 hover:text-rose-400 flex items-center gap-1">
                        <RefreshCw size={12} />Clear
                      </button>
                    )}
                  </div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write something beautiful from the heart... 💕"
                    rows={8}
                    className="input-glass w-full px-4 py-3 rounded-2xl text-sm resize-none"
                  />
                  <div className="flex justify-between mt-1.5">
                    <span className="text-xs text-gray-400">{message.length} characters</span>
                    {message.length < 10 && message.length > 0 && (
                      <span className="text-xs text-rose-400">Add at least {10 - message.length} more characters</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Theme */}
            {step === 4 && (
              <div>
                <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-2">Choose a theme 🎨</h2>
                <p className="text-gray-400 text-sm mb-8">Pick the aesthetic that matches the mood</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {THEMES.map((t) => (
                    <motion.button
                      key={t.id}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setTheme(t.id)}
                      className={`relative rounded-2xl overflow-hidden transition-all ${
                        theme === t.id ? 'ring-2 ring-rose-500 ring-offset-2' : ''
                      }`}
                    >
                      <div className={`h-20 bg-gradient-to-br ${t.gradient} flex items-center justify-center text-3xl`}>
                        {t.emoji}
                      </div>
                      <div className="p-2 bg-white border-t border-gray-100">
                        <div className="text-xs font-semibold text-gray-800 truncate">{t.name}</div>
                        {t.isPremium && <span className="text-[10px] text-amber-500 font-bold">👑 Premium</span>}
                      </div>
                      {theme === t.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Review & Publish */}
            {step === 5 && (
              <div>
                <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-2">Ready to share! 🚀</h2>
                <p className="text-gray-400 text-sm mb-8">Review your wish before publishing</p>

                <div className={`rounded-2xl bg-gradient-to-br ${selectedTheme.gradient} p-6 mb-6 text-white`}>
                  <div className="text-center">
                    <div className="text-4xl mb-3">{selectedTheme.emoji}</div>
                    <h3 className="font-playfair text-xl font-bold mb-1">
                      For {recipientName || 'Someone Special'} 💕
                    </h3>
                    <p className="text-white/80 text-xs mb-4">From {senderName || 'Me'} with love</p>
                    <p className="text-white/90 text-sm leading-relaxed max-w-sm mx-auto line-clamp-3">
                      {message || 'Your beautiful message will appear here...'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6 text-sm">
                  {[
                    { label: 'Occasion', value: category.replace('-', ' ') },
                    { label: 'Theme', value: selectedTheme.name },
                    { label: 'Recipient', value: recipientName },
                    { label: 'From', value: senderName },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-pink-50">
                      <span className="text-gray-400">{label}</span>
                      <span className="font-semibold text-gray-700 capitalize">{value}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSaveAndPublish}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-lg shadow-xl shadow-rose-200 hover:shadow-rose-300 hover:scale-[1.02] transition-all disabled:opacity-70"
                >
                  {saving ? <Loader2 size={20} className="animate-spin" /> : <><Globe size={20} />Publish My ForeverWish 🎉</>}
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">
                  Your wish will get a unique shareable link
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-gray-500 border border-gray-200 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold text-sm"
          >
            <ChevronLeft size={16} />Back
          </button>
          {step < 5 && (
            <button
              onClick={() => setStep(Math.min(5, step + 1))}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-sm shadow-md hover:shadow-rose-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next<ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
