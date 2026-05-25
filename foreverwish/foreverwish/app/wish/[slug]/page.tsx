'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import { getProjectBySlug, incrementViewCount } from '@/lib/db';
import { WishProject } from '@/types';
import { getTheme, getShareUrl, WHATSAPP_SHARE } from '@/lib/utils';
import CountdownTimer from '@/components/wish/CountdownTimer';
import { Copy, Share2, Heart, ChevronDown, Loader2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

const Confetti = dynamic(() => import('react-confetti'), { ssr: false });

const PARTICLE_EMOJIS = ['💕', '✨', '🌸', '💫', '🎀', '💝', '⭐', '🎊'];

export default function WishPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<WishProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState(250);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [photoIndex, setPhotoIndex] = useState(0);
  const shareUrl = project ? getShareUrl(project.slug) : '';

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handler = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    if (!slug) return;
    getProjectBySlug(slug as string).then((p) => {
      setProject(p);
      setLoading(false);
      if (p) {
        incrementViewCount(p.id);
        if (!p.isPasswordProtected) setUnlocked(true);
      }
    });
  }, [slug]);

  const handleOpen = () => {
    setOpened(true);
    setShowConfetti(true);
    setTimeout(() => setConfettiPieces(0), 5000);
  };

  const handlePassword = () => {
    if (project && passwordInput === project.password) {
      setUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied! 🔗');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-6xl mb-4"
          >
            💝
          </motion.div>
          <Loader2 className="w-8 h-8 text-rose-400 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">🌸</div>
          <h1 className="font-playfair text-3xl font-bold text-gray-800 mb-2">
            Wish not found
          </h1>
          <p className="text-gray-400">
            This wish may have been deleted or the link is incorrect.
          </p>
        </div>
      </div>
    );
  }

  const theme = getTheme(project.theme);

  // Password gate
  if (project.isPasswordProtected && !unlocked) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${theme.gradient} p-4`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
        >
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-2">
            This wish is private
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Enter the secret code to open your surprise
          </p>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePassword()}
            placeholder="Enter secret code..."
            className={`w-full px-4 py-3 rounded-2xl border-2 text-center text-sm mb-3 outline-none transition-all ${
              passwordError ? 'border-red-400 bg-red-50' : 'border-pink-200 bg-pink-50'
            }`}
          />
          {passwordError && (
            <p className="text-red-400 text-xs mb-3">Incorrect code, try again 💔</p>
          )}
          <button
            onClick={handlePassword}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold"
          >
            Open Surprise 🎁
          </button>
        </motion.div>
      </div>
    );
  }

  // Intro screen
  if (!opened) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${theme.gradient} overflow-hidden relative`}>
        {/* Floating particles */}
        {PARTICLE_EMOJIS.map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl pointer-events-none"
            style={{ left: `${5 + i * 12}%`, top: `${15 + (i % 3) * 25}%` }}
            animate={{ y: [-20, 20, -20], rotate: [-10, 10, -10], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
          >
            {emoji}
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
          className="text-center px-6 z-10"
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="text-8xl mb-6"
          >
            🎁
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-playfair text-4xl sm:text-5xl font-bold text-white mb-3 drop-shadow-lg"
          >
            Hey {project.recipientName}!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/80 text-lg mb-2"
          >
            {project.senderName} made you something special
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-white/60 text-sm mb-10"
          >
            Tap below to open your surprise ✨
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpen}
            className="px-10 py-5 rounded-full bg-white text-rose-600 font-bold text-xl shadow-2xl hover:shadow-white/30 transition-all"
          >
            Open Your Surprise 🎁
          </motion.button>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mt-8 text-white/40"
          >
            <ChevronDown size={24} className="mx-auto" />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Full wish page
  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradient}`}>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={confettiPieces}
          recycle={false}
          colors={['#f43f5e', '#ec4899', '#8b5cf6', '#f59e0b', '#ffffff', '#fda4af']}
        />
      )}

      {/* Hero */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center overflow-hidden">
        {/* Floating particles */}
        {PARTICLE_EMOJIS.map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-xl pointer-events-none select-none"
            style={{ left: `${5 + i * 12}%` }}
            initial={{ y: '110vh', opacity: 0 }}
            animate={{ y: '-10vh', opacity: [0, 0.6, 0.6, 0] }}
            transition={{ duration: 6 + i, repeat: Infinity, delay: i * 0.8, ease: 'linear' }}
          >
            {emoji}
          </motion.div>
        ))}

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 150, delay: 0.1 }}
          className="text-7xl mb-6"
        >
          {theme.emoji}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-playfair text-4xl sm:text-6xl font-bold text-white mb-4 drop-shadow-lg leading-tight"
        >
          {project.category === 'birthday' && `Happy Birthday,`}
          {project.category === 'anniversary' && `Happy Anniversary,`}
          {project.category === 'best-friend' && `Hey Best Friend,`}
          {project.category === 'couple' && `For My Love,`}
          {project.category === 'farewell' && `Farewell,`}
          {project.category === 'friendship' && `To My Friend,`}
          {project.category === 'proposal' && `Will You Marry Me,`}
          {project.category === 'memory-collection' && `Our Memories,`}
          <br />
          <span className="font-dancing text-5xl sm:text-7xl">{project.recipientName}!</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-white/70 text-base mb-3"
        >
          with love from
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="font-dancing text-3xl text-white mb-10"
        >
          {project.senderName} 💕
        </motion.p>

        {/* Countdown */}
        {project.countdownDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-10"
          >
            <p className="text-white/60 text-xs uppercase tracking-widest mb-3">
              Counting down to the big day
            </p>
            <CountdownTimer targetDate={project.countdownDate} theme="dark" />
          </motion.div>
        )}

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/40 mt-4"
        >
          <ChevronDown size={28} className="mx-auto" />
        </motion.div>
      </div>

      {/* Message section */}
      <div className="bg-white/10 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/20 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-white/30 shadow-xl"
          >
            <div className="text-3xl mb-4 text-center">💌</div>
            <p className="font-playfair text-white text-lg sm:text-xl leading-relaxed text-center italic">
              "{project.message}"
            </p>
            <div className="mt-6 text-center">
              <span className="text-white/60 text-sm">— {project.senderName}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Photos section */}
      {project.photos && project.photos.length > 0 && (
        <div className="bg-black/10">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-playfair text-3xl font-bold text-white text-center mb-10"
            >
              Our Memories 📸
            </motion.h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {project.photos.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.04, zIndex: 10 }}
                  className="aspect-square rounded-2xl overflow-hidden shadow-xl cursor-pointer"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || `Memory ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      {project.timeline && project.timeline.length > 0 && (
        <div className="bg-white/5">
          <div className="max-w-2xl mx-auto px-4 py-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-playfair text-3xl font-bold text-white text-center mb-12"
            >
              Our Story Timeline ✨
            </motion.h2>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/20" />
              <div className="space-y-8">
                {project.timeline.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-6 pl-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl flex-shrink-0 border-2 border-white/30 shadow-lg z-10">
                      {item.emoji}
                    </div>
                    <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 flex-1 border border-white/20">
                      <div className="text-white/50 text-xs mb-1">{item.date}</div>
                      <div className="font-bold text-white mb-1">{item.title}</div>
                      <div className="text-white/70 text-sm">{item.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share section */}
      <div className="bg-black/20 backdrop-blur-sm">
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl mb-6"
            >
              💕
            </motion.div>
            <h3 className="font-playfair text-2xl font-bold text-white mb-3">
              Share this wish
            </h3>
            <p className="text-white/60 text-sm mb-8">
              Spread the love — share this page with others
            </p>

            <div className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3 mb-6 border border-white/20">
              <span className="text-white/60 text-xs flex-1 truncate text-left">
                {shareUrl}
              </span>
              <button
                onClick={copyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 text-white text-xs font-semibold hover:bg-white/30 transition-colors flex-shrink-0"
              >
                <Copy size={12} />
                Copy
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={WHATSAPP_SHARE(shareUrl, project.recipientName)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-green-500 text-white font-semibold text-sm hover:bg-green-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
              <button
                onClick={copyLink}
                className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/20 text-white font-semibold text-sm hover:bg-white/30 transition-colors border border-white/30"
              >
                <Share2 size={16} />
                Copy Link
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black/30 py-6 text-center">
        <p className="text-white/40 text-xs">
          Made with 💝 on{' '}
          <a href="/" className="text-white/60 hover:text-white transition-colors font-semibold">
            ForeverWish
          </a>
          {' '}· Create yours for free
        </p>
      </div>
    </div>
  );
}
