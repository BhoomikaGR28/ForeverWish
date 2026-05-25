'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'Is ForeverWish free to use?',
    a: 'Yes! You can create up to 3 wish pages completely free with 5 photos each. For unlimited pages, all themes, videos, music, and premium features, upgrade to Premium.',
  },
  {
    q: 'How do I share my wish page?',
    a: 'Once published, you get a unique shareable link. Share it via WhatsApp, Instagram, copy it, or scan the QR code. Anyone with the link can view it — no account needed.',
  },
  {
    q: 'Can I add background music?',
    a: 'Yes! Premium users can upload an audio file or add a YouTube music link that autoplays when someone opens their wish page.',
  },
  {
    q: 'What is the AI wish generator?',
    a: "Our AI (powered by Claude) can write the perfect personalized message in 8 styles — Romantic, Funny, Emotional, Cute, Best Friend, Sibling, Formal, and Heart-Touching. It's available on Premium plans.",
  },
  {
    q: 'Are the wish pages mobile-friendly?',
    a: 'Absolutely! ForeverWish is designed mobile-first. Every wish page is beautiful on phones — perfect for Instagram story-style sharing.',
  },
  {
    q: 'Can I password-protect my wish?',
    a: "Yes! Premium users can add a password so only the intended recipient can open it. Great for extra-special surprises.",
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept all major Indian payment methods through Razorpay — UPI, credit/debit cards, net banking, and wallets.',
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-24 bg-white" ref={ref}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-rose-50 text-rose-600 text-sm font-semibold mb-4">
            ❓ Common Questions
          </span>
          <h2 className="font-playfair text-4xl font-bold text-gray-900">
            Got questions?{' '}
            <span className="gradient-text">We got answers</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.05 }}
              className="border border-pink-100 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-pink-50/50 transition-colors"
              >
                <span className="font-semibold text-gray-800 text-sm sm:text-base">
                  {faq.q}
                </span>
                <motion.div
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 ml-4"
                >
                  <ChevronDown size={18} className="text-rose-400" />
                </motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-gray-500 text-sm leading-relaxed border-t border-pink-50">
                      <div className="pt-3">{faq.a}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
