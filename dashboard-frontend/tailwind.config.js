import flowbite from 'flowbite/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  darkMode: 'class',
  theme: {
    screens: {
      md: '640px',
      lg: '1024px',
      xl: '1440px',
    },
    extend: {
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'spin-slow-reverse': 'spin 15s linear infinite reverse',
        float: 'float 6s ease-in-out infinite',
        pulse: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        fadeIn: 'fadeIn 0.5s ease-in-out forwards',
        slideInRight: 'slideInRight 0.5s ease-in-out forwards',
        slideInUp: 'slideInUp 0.5s ease-in-out forwards',
        scaleIn: 'scaleIn 0.5s ease-in-out forwards',
        scrollDown: 'scrollDown 2s ease-in-out infinite',
        ripple: 'ripple 1s ease-in-out infinite',
        ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        bounce: 'bounce 1s infinite',
        fadeInUp: 'fadeInUp 0.5s ease-out forwards',
        fadeInDown: 'fadeInDown 0.5s ease-out forwards',
        fadeInLeft: 'fadeInLeft 0.5s ease-out forwards',
        fadeInRight: 'fadeInRight 0.5s ease-out forwards',
        zoomIn: 'zoomIn 0.5s ease-out forwards',
        zoomOut: 'zoomOut 0.5s ease-out forwards',
        hideScreen: 'hideScreen 0.5s ease-in-out forwards',
        buttonRipple: 'buttonRipple 0.6s linear forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '0.1' },
          '50%': { opacity: '0.2' },
        },
        fadeIn: {
          '0%': { opacity: '0', visibility: 'hidden' },
          '100%': { opacity: '1', visibility: 'visible' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0', visibility: 'hidden' },
          '100%': { transform: 'translateX(0)', opacity: '1', visibility: 'visible' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0', visibility: 'hidden' },
          '100%': { transform: 'translateY(0)', opacity: '1', visibility: 'visible' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0', visibility: 'hidden' },
          '100%': { transform: 'scale(1)', opacity: '1', visibility: 'visible' },
        },
        scrollDown: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        ping: {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)', visibility: 'hidden' },
          '100%': { opacity: '1', transform: 'translateY(0)', visibility: 'visible' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)', visibility: 'hidden' },
          '100%': { opacity: '1', transform: 'translateY(0)', visibility: 'visible' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)', visibility: 'hidden' },
          '100%': { opacity: '1', transform: 'translateX(0)', visibility: 'visible' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)', visibility: 'hidden' },
          '100%': { opacity: '1', transform: 'translateX(0)', visibility: 'visible' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0', visibility: 'hidden' },
          '100%': { transform: 'scale(1)', opacity: '1', visibility: 'visible' },
        },
        zoomOut: {
          '0%': { transform: 'scale(1.05)', opacity: '0', visibility: 'hidden' },
          '100%': { transform: 'scale(1)', opacity: '1', visibility: 'visible' },
        },
        hideScreen: {
          '0%': { opacity: '1', visibility: 'visible' },
          '100%': { opacity: '0', visibility: 'hidden' },
        },
        buttonRipple: {
          '0%': { transform: 'scale(0)', opacity: '0.3' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
      },
    },
  },
  plugins: [flowbite],
};
