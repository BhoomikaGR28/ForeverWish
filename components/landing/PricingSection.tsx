'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Check, Sparkles, Crown } from 'lucide-react';
import Link from 'next/link';
import { PRICING_PLANS } from '@/lib/constants';

export default function PricingSection() {
  const [yearly, setYearly] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="pricing" className="py-24 bg-white" ref={ref}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-50 text-amber-600 text-sm font-semibold mb-4">
            💫 Simple Pricing
          </span>
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Choose your{' '}
            <span className="gradient-text">forever plan</span>
          </h2>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 mt-6 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setYearly(false)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                !yearly ? 'bg-white shadow text-gray-800' : 'text-gray-500'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1 ${
                yearly ? 'bg-white shadow text-gray-800' : 'text-gray-500'
              }`}
            >
              Yearly
              <span className="text-xs text-emerald-600 font-bold">-30%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -4 }}
              className={`relative rounded-3xl p-8 border-2 transition-all ${
                plan.isPopular
                  ? 'border-rose-400 bg-gradient-to-br from-rose-50 to-pink-50 shadow-xl shadow-rose-100'
                  : 'border-gray-200 bg-white shadow-md'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold shadow-lg">
                    <Crown size={12} />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    plan.isPremium
                      ? 'bg-gradient-to-br from-rose-400 to-pink-400'
                      : 'bg-gray-100'
                  }`}
                >
                  {plan.isPremium ? (
                    <Crown size={18} className="text-white" />
                  ) : (
                    <span className="text-lg">🎁</span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900">{plan.name}</h3>
                  <p className="text-gray-400 text-xs">
                    {plan.isPremium ? 'Full access' : 'Get started'}
                  </p>
                </div>
              </div>

              <div className="mb-8">
                {plan.price === 0 ? (
                  <div className="text-4xl font-bold text-gray-900">Free</div>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold text-gray-500">₹</span>
                    <span className="text-4xl font-bold text-gray-900">
                      {yearly
                        ? Math.round(plan.yearlyPrice / 12)
                        : plan.price}
                    </span>
                    <span className="text-gray-400 text-sm">/month</span>
                  </div>
                )}
                {plan.isPremium && yearly && (
                  <p className="text-sm text-emerald-600 font-semibold mt-1">
                    ₹{plan.yearlyPrice}/year — Save ₹{plan.price * 12 - plan.yearlyPrice}
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        plan.isPremium ? 'bg-rose-100' : 'bg-gray-100'
                      }`}
                    >
                      <Check
                        size={12}
                        className={plan.isPremium ? 'text-rose-500' : 'text-gray-500'}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.isPremium ? '/dashboard' : '/create'}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold transition-all ${
                  plan.isPremium
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:shadow-lg hover:shadow-rose-200 hover:scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {plan.isPremium && <Sparkles size={16} />}
                {plan.isPremium ? 'Get Premium' : 'Start Free'}
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          🔒 Secure payment via Razorpay · Cancel anytime · No hidden fees
        </p>
      </div>
    </section>
  );
}
