import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'lol-dark': '#020A13',
        'lol-navy': '#0A1428',
        'lol-navy-light': '#0E1F35',
        'lol-blue': '#1E3D5A',
        'lol-blue-light': '#2A5298',
        'lol-gold': '#C89B3C',
        'lol-gold-light': '#F0E6D3',
        'lol-gold-dim': '#785A28',
        'lol-text': '#A0B4B7',
        'lol-text-bright': '#C8D6D9',
        'lol-teal': '#0BC4E3',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(200, 155, 60, 0.4)' },
          '50%': { boxShadow: '0 0 20px rgba(200, 155, 60, 0.8)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
