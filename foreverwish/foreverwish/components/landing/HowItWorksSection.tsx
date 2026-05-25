'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

const STEPS = [
  {
    step: '01',
    emoji: '📝',
    title: 'Pick a Category',
    desc: 'Choose from Birthday, Anniversary, Best Friend, Proposal, and more.',
    color: 'from-rose-400 to-pink-400',
  },
  {
    step: '02',
    emoji: '🎨',
    title: 'Customize It',
    desc: 'Add photos, videos, music, voice notes, and write your heartfelt message.',
    color: 'from-violet-400 to-purple-400',
  },
  {
    step: '03',
    emoji: '✨',
    title: 'AI Helps You',
    desc: 'Use our AI to generate the perfect wish in any style you want.',
    color: 'from-amber-400 to-orange-400',
  },
  {
    step: '04',
    emoji: '🔗',
    title: 'Share the Magic',
    desc: 'Get a unique link and share it via WhatsApp, Instagram, or anywhere.',
    color: 'from-emerald-400 to-teal-400',
  },
];

export default function HowItWorksSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-pink-50/50 to-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-violet-50 text-violet-600 text-sm font-semibold mb-4">
            🚀 Simple as 1-2-3-4
          </span>
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Create a wish in{' '}
            <span className="gradient-text">minutes</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            No design skills needed. Just love, and a few minutes.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-16 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-rose-200 via-violet-200 to-emerald-200" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-4xl shadow-lg shadow-rose-100`}
                  >
                    {step.emoji}
                  </motion.div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-pink-200 flex items-center justify-center text-xs font-bold text-rose-500">
                    {step.step}
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center mt-16"
        >
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-lg shadow-xl shadow-rose-200 hover:shadow-rose-300 hover:scale-105 transition-all"
          >
            ✨ Start Creating for Free
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
