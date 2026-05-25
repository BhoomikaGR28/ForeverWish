import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ["'Playfair Display'", 'Georgia', 'serif'],
        dancing:  ["'Dancing Script'", 'cursive'],
        quicksand:["'Quicksand'", 'system-ui', 'sans-serif'],
      },
      animation: {
        float:       'float 6s ease-in-out infinite',
        'float-slow':'floatSlow 8s ease-in-out infinite',
        heartbeat:   'heartbeat 2s ease-in-out infinite',
        twinkle:     'twinkle 3s ease-in-out infinite',
        'slide-up':  'slideUp .6s ease-out forwards',
        shimmer:     'shimmer 2s infinite',
      },
      keyframes: {
        float: {
          '0%,100%':{ transform:'translateY(0px) rotate(0deg)' },
          '33%':    { transform:'translateY(-15px) rotate(5deg)' },
          '66%':    { transform:'translateY(-8px) rotate(-3deg)' },
        },
        floatSlow: {
          '0%,100%':{ transform:'translateY(0px)' },
          '50%':    { transform:'translateY(-20px)' },
        },
        heartbeat:{
          '0%,100%':{ transform:'scale(1)' },
          '50%':    { transform:'scale(1.1)' },
        },
        twinkle:{
          '0%,100%':{ opacity:'1', transform:'scale(1)' },
          '50%':    { opacity:'0.3', transform:'scale(0.8)' },
        },
        slideUp:{
          from:{ opacity:'0', transform:'translateY(30px)' },
          to:  { opacity:'1', transform:'translateY(0)' },
        },
        shimmer:{
          '0%':  { backgroundPosition:'-200% center' },
          '100%':{ backgroundPosition:'200% center' },
        },
      },
      boxShadow: {
        glow:    '0 0 25px rgba(244,63,94,.5)',
        'glow-sm':'0 0 15px rgba(244,63,94,.3)',
        glass:   '0 8px 32px rgba(31,38,135,.07)',
      },
    },
  },
  plugins: [],
};

export default config;
