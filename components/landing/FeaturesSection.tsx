'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Music,
  Image,
  Sparkles,
  Timer,
  Share2,
  Lock,
  Mic,
  Palette,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Image,
    emoji: '📸',
    title: 'Photos & Videos',
    desc: 'Upload unlimited photos and videos to create a cinematic gallery.',
    color: 'from-rose-400 to-pink-400',
    bg: 'bg-rose-50',
  },
  {
    icon: Music,
    emoji: '🎵',
    title: 'Background Music',
    desc: 'Add their favorite song to play as they open your surprise.',
    color: 'from-violet-400 to-purple-400',
    bg: 'bg-violet-50',
  },
  {
    icon: Mic,
    emoji: '🎤',
    title: 'Voice Notes',
    desc: 'Record a heartfelt voice message that plays automatically.',
    color: 'from-amber-400 to-orange-400',
    bg: 'bg-amber-50',
  },
  {
    icon: Sparkles,
    emoji: '🤖',
    title: 'AI Wish Generator',
    desc: 'Generate perfect wishes in 8 styles with our AI assistant.',
    color: 'from-cyan-400 to-blue-400',
    bg: 'bg-cyan-50',
  },
  {
    icon: Timer,
    emoji: '⏰',
    title: 'Countdown Timer',
    desc: 'Build anticipation with a beautiful live countdown clock.',
    color: 'from-emerald-400 to-teal-400',
    bg: 'bg-emerald-50',
  },
  {
    icon: Palette,
    emoji: '🎨',
    title: 'Premium Themes',
    desc: '8 stunning themes crafted for every mood and occasion.',
    color: 'from-pink-400 to-rose-400',
    bg: 'bg-pink-50',
  },
  {
    icon: Share2,
    emoji: '🔗',
    title: 'One-Click Sharing',
    desc: 'Share on WhatsApp, Instagram, or any platform in one tap.',
    color: 'from-indigo-400 to-violet-400',
    bg: 'bg-indigo-50',
  },
  {
    icon: Lock,
    emoji: '🔒',
    title: 'Password Protection',
    desc: 'Keep your wish private and reveal it only to the right person.',
    color: 'from-orange-400 to-amber-400',
    bg: 'bg-orange-50',
  },
];

export default function FeaturesSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="features" className="py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-rose-50 text-rose-600 text-sm font-semibold mb-4">
            ✨ Everything you need
          </span>
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Make every wish{' '}
            <span className="gradient-text">extraordinary</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Powerful features that turn a simple message into an unforgettable
            emotional experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`p-6 rounded-2xl ${feature.bg} border border-white/80 shadow-sm hover:shadow-md transition-all cursor-default`}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-sm`}
              >
                <span className="text-xl">{feature.emoji}</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
