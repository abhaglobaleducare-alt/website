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
        'primary-navy': '#0B1A35',
        'primary-gold': '#C6962E',
        'accent-blue': '#1B7C9E',
        'light-gray': '#F8F9FA',
        navy: {
          50: '#E8EBF0',
          100: '#D1D7E1',
          200: '#A3AFC3',
          300: '#7587A5',
          400: '#475F87',
          500: '#193769',
          600: '#152E57',
          700: '#112545',
          800: '#0B1A35',
          900: '#071122',
        },
        gold: {
          50: '#FBF6EB',
          100: '#F7EDD7',
          200: '#EFDBB0',
          300: '#E7C988',
          400: '#DFB761',
          500: '#C6962E',
          600: '#A67B25',
          700: '#85611C',
          800: '#654713',
          900: '#442D0A',
        },
        blue: {
          50: '#E8F4F7',
          100: '#D1E9EF',
          200: '#A3D3DF',
          300: '#75BDCF',
          400: '#47A7BF',
          500: '#1B7C9E',
          600: '#166882',
          700: '#125467',
          800: '#0D404C',
          900: '#092C32',
        },
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-right': 'fadeInRight 0.6s ease-out forwards',
        'fade-in-left': 'fadeInLeft 0.6s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        bounce: 'bounce 1s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeInRight: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        fadeInLeft: {
          '0%': {
            opacity: '0',
            transform: 'translateX(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-pattern': "url('/images/hero-pattern.svg')",
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(11, 26, 53, 0.1)',
        'glass-lg': '0 16px 48px rgba(11, 26, 53, 0.15)',
        'gold': '0 4px 20px rgba(198, 150, 46, 0.3)',
        'navy': '0 4px 20px rgba(11, 26, 53, 0.3)',
        'card': '0 4px 24px rgba(11, 26, 53, 0.08)',
        'card-hover': '0 8px 32px rgba(11, 26, 53, 0.14)',
      },
      backdropBlur: {
        xs: '2px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
