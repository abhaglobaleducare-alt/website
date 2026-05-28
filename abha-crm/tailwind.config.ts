import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#0B2545',
          600: '#1C3B73',
          500: '#2F4E98',
        },
        saffron: '#F5A623',
      },
      boxShadow: {
        soft: '0 20px 45px rgba(11, 37, 69, 0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config;
