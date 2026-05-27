'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Play, ArrowRight } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';

const BALLOONS = ['🎈', '🎀', '💕', '✨', '🌸', '🎊', '💝', '⭐'];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50/50 to-rose-50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(244,63,94,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.12),transparent_60%)]" />

      {/* Floating emojis */}
      {BALLOONS.map((emoji, i) => (
        <motion.div
          key={i}
          initial={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            opacity: 0,
          }}
          animate={{
            y: [`${20 + Math.random() * 60}vh`, `${10 + Math.random() * 40}vh`],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: i * 0.4,
          }}
          className="absolute text-2xl pointer-events-none select-none"
          style={{ left: `${8 + i * 11}%` }}
        >
          {emoji}
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-pink-200 text-rose-600 text-sm font-semibold shadow-sm mb-8"
        >
          <Sparkles size={14} className="text-rose-500" />
          <span>✨ 50,000+ wishes created</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-gray-900 mb-6"
        >
          Create wishes that
          <br />
          <span className="gradient-text relative">
            last forever
            <motion.span
              className="absolute -right-8 top-0"
              animate={{ rotate: [0, 20, -10, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              💝
            </motion.span>
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-500 mb-4 max-w-2xl mx-auto"
        >
          Beautiful personalized pages for
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl sm:text-2xl font-semibold text-rose-500 mb-10 h-8"
        >
          <TypeAnimation
            sequence={[
              '🎂 Birthdays',
              2000,
              '💍 Anniversaries',
              2000,
              '👯 Best Friends',
              2000,
              '💕 Couples',
              2000,
              '🎊 Farewells',
              2000,
              '📸 Memory Collections',
              2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
          />
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/create"
            className="group flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-lg shadow-xl shadow-rose-200 hover:shadow-rose-300 hover:scale-105 transition-all btn-glow"
          >
            <Sparkles size={20} />
            Create Your ForeverWish
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowRight size={18} />
            </motion.span>
          </Link>
          <button className="flex items-center gap-3 px-8 py-4 rounded-full bg-white/80 backdrop-blur-sm border border-pink-200 text-gray-700 font-semibold text-lg hover:bg-white hover:shadow-lg transition-all">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-rose-400 to-pink-400 flex items-center justify-center">
              <Play size={12} fill="white" className="text-white ml-0.5" />
            </div>
            See Demo
          </button>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <div className="flex -space-x-3">
            {['🧑‍💻', '👩‍❤️‍👨', '🧑‍🎨', '👩‍💼', '🧑‍🎤'].map((emoji, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-300 to-rose-400 border-2 border-white flex items-center justify-center text-lg shadow-sm"
              >
                {emoji}
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-500">
            <span className="font-bold text-gray-800">2,847</span> people created a wish this week
            <div className="flex items-center gap-1 justify-center sm:justify-start">
              {'⭐⭐⭐⭐⭐'.split('').map((s, i) => (
                <span key={i} className="text-amber-400 text-xs">{s}</span>
              ))}
              <span className="ml-1 font-semibold">4.9/5</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Preview mockup */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.8 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 pointer-events-none"
      >
        <div className="bg-white/70 backdrop-blur-xl rounded-t-3xl border border-pink-100 shadow-2xl p-6 mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <div className="flex-1 bg-pink-50 rounded-full h-6 mx-4 flex items-center justify-center">
              <span className="text-xs text-gray-400">foreverwish.app/wish/priya-surprise-✨</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-rose-400 via-pink-400 to-purple-500 rounded-2xl h-32 sm:h-48 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-4xl mb-2">🎂</div>
              <div className="font-playfair text-2xl font-bold">Happy Birthday, Priya! 🌸</div>
              <div className="text-white/80 text-sm mt-1">A surprise from Arjun, made with love 💕</div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
