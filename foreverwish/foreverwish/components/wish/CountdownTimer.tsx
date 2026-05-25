'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCountdown } from '@/lib/utils';

interface CountdownTimerProps {
  targetDate: string;
  theme?: 'light' | 'dark';
}

export default function CountdownTimer({
  targetDate,
  theme = 'dark',
}: CountdownTimerProps) {
  const [countdown, setCountdown] = useState(getCountdown(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!countdown) return null;

  const isLight = theme === 'light';
  const units = [
    { label: 'Days', value: countdown.days },
    { label: 'Hours', value: countdown.hours },
    { label: 'Minutes', value: countdown.minutes },
    { label: 'Seconds', value: countdown.seconds },
  ];

  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {units.map(({ label, value }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`flex flex-col items-center px-4 py-3 rounded-2xl min-w-[70px] ${
            isLight
              ? 'bg-white/20 backdrop-blur-sm border border-white/30'
              : 'bg-black/30 backdrop-blur-sm border border-white/10'
          }`}
        >
          <motion.span
            key={value}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-3xl font-bold font-playfair ${
              isLight ? 'text-rose-600' : 'text-white'
            }`}
          >
            {String(value).padStart(2, '0')}
          </motion.span>
          <span
            className={`text-xs uppercase tracking-widest mt-1 ${
              isLight ? 'text-rose-400' : 'text-white/60'
            }`}
          >
            {label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
