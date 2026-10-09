import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: '#38bdf8',
          purple: '#a855f7',
          emerald: '#10b981',
          rose: '#f43f5e'
        },
        dark: {
          950: '#06090e',
          900: '#0b0f17',
          800: '#141c2b',
          700: '#1e293b'
        }
      }
    },
  },
  plugins: [],
};

export default config;
