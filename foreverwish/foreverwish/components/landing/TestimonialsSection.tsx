'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Gifted to her boyfriend',
    emoji: '💕',
    text: "He literally cried when he opened it! The way the music started playing and photos appeared one by one — it was so cinematic. This is the most thoughtful gift I've ever given.",
    rating: 5,
    color: 'from-rose-100 to-pink-100',
  },
  {
    name: 'Rahul Verma',
    role: 'Made for his mom\'s birthday',
    emoji: '🎂',
    text: "My mom is 60 and not very tech-savvy, but she loved it. She was in tears watching the memory timeline. ForeverWish made me the best son in the world for a day 😄",
    rating: 5,
    color: 'from-violet-100 to-purple-100',
  },
  {
    name: 'Sneha & Karthik',
    role: '5th anniversary surprise',
    emoji: '💍',
    text: "We used the couple theme for our anniversary and it was absolutely stunning. The countdown timer, the photos, the voice note — everything came together perfectly. 10/10.",
    rating: 5,
    color: 'from-amber-100 to-orange-100',
  },
  {
    name: 'Aisha Khan',
    role: 'Farewell wish for her bestie',
    emoji: '✈️',
    text: "My best friend is moving abroad and I wanted to give her something to remember. The memory timeline with our photos made everyone in the room cry. Beautiful product!",
    rating: 5,
    color: 'from-cyan-100 to-teal-100',
  },
  {
    name: 'Dev Patel',
    role: 'Proposal surprise',
    emoji: '💎',
    text: "I used the proposal template and she said yes before I even finished setting it up 😂. The AI wish generator wrote something so beautiful, I was genuinely moved by it.",
    rating: 5,
    color: 'from-emerald-100 to-green-100',
  },
  {
    name: 'Meera Nair',
    role: 'Friendship day wishes',
    emoji: '👯‍♀️',
    text: "Made one for each of my 3 best friends. They were fighting over who got the best one! The floating hearts and confetti burst had us all screaming. Absolutely viral-worthy.",
    rating: 5,
    color: 'from-fuchsia-100 to-pink-100',
  },
];

export default function TestimonialsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-24 bg-gradient-to-b from-pink-50/50 to-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-pink-50 text-rose-600 text-sm font-semibold mb-4">
            💬 Real Stories
          </span>
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Wishes that{' '}
            <span className="gradient-text">made people cry</span>
          </h2>
          <p className="text-gray-500 text-lg">
            In the best way possible 😢💕
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className={`p-6 rounded-2xl bg-gradient-to-br ${t.color} border border-white/80 shadow-sm`}
            >
              <div className="flex items-center gap-1 mb-3">
                {'⭐'.repeat(t.rating).split('').map((s, si) => (
                  <span key={si} className="text-amber-400 text-sm">{s}</span>
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-xl shadow-sm">
                  {t.emoji}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
