'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function CTASection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 p-12 sm:p-16 text-center shadow-2xl"
        >
          {/* Background decorations */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-32 -translate-y-32" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-32 translate-y-32" />

          {/* Floating emojis */}
          {['💕', '✨', '🎊', '💝', '🌸'].map((emoji, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl opacity-30"
              style={{
                top: `${15 + i * 15}%`,
                left: `${5 + i * 20}%`,
              }}
              animate={{ y: [-10, 10, -10] }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              {emoji}
            </motion.div>
          ))}

          <div className="relative z-10">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-5xl mb-6"
            >
              💝
            </motion.div>
            <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white mb-4">
              Someone deserves a
              <br />
              forever wish today
            </h2>
            <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
              Create something they'll treasure forever. It takes just 5 minutes
              and zero design skills.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/create"
                className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white text-rose-600 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              >
                <Sparkles size={20} />
                Create for Free
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                href="/auth"
                className="px-8 py-4 rounded-full border-2 border-white/50 text-white font-semibold hover:bg-white/10 transition-all"
              >
                Sign Up Free
              </Link>
            </div>
            <p className="text-white/50 text-sm mt-6">
              No credit card required · 3 free wishes forever
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
