/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        zen: {
          // Forest Green Palette
          forest: {
            dark: '#1a3d2e',
            medium: '#2d5b3e',
            light: '#4a7c59',
          },
          sage: '#6b8e5a',
          mint: '#8fbc8f',
          bamboo: '#a8d5a8',

          // Orange Accent Palette
          orange: {
            deep: '#c65d21',
            accent: '#d97a34',
            warm: '#e89851',
            soft: '#f4b56f',
            light: '#fdd5a8',
          },

          // Neutral Palette
          white: '#fdfcf8',
          cream: '#f9f7f1',
          gray: {
            light: '#e8e6e0',
            medium: '#b8b6b0',
            dark: '#6b6b6b',
          },
          charcoal: '#2c2c2c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Noto Serif', 'ui-serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        'zen': '0 2px 12px rgba(45, 91, 62, 0.08)',
        'zen-md': '0 4px 24px rgba(45, 91, 62, 0.12)',
        'zen-lg': '0 8px 40px rgba(45, 91, 62, 0.16)',
        'zen-glow': '0 0 20px rgba(217, 122, 52, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
