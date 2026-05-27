'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Globe2, Send, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white to-pink-50 border-t border-pink-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">💝</span>
              <span className="font-playfair font-bold text-xl gradient-text-pink">
                ForeverWish
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Create beautiful, personalized celebration pages that capture
              emotions and memories — shared as a single magical link.
            </p>
            <div className="flex gap-4 mt-6">
              {[
                { icon: Globe2, href: '#', label: 'Instagram' },
                { icon: Send, href: '#', label: 'Twitter' },
                { icon: Mail, href: 'mailto:hello@foreverwish.app', label: 'Email' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Product</h4>
            <ul className="space-y-2">
              {['Features', 'Pricing', 'Templates', 'Examples', 'AI Wishes'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-rose-500 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Company</h4>
            <ul className="space-y-2">
              {['About', 'Blog', 'Privacy Policy', 'Terms of Service', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-rose-500 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-pink-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © 2024 ForeverWish. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 flex items-center gap-1.5">
            Made with{' '}
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-rose-500"
            >
              <Heart size={14} fill="currentColor" />
            </motion.span>{' '}
            for moments that matter
          </p>
        </div>
      </div>
    </footer>
  );
}
