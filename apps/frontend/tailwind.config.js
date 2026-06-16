/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: '#0B1111',
        section: '#152A2D',
        card: '#3F5C62',
        border: '#548A90',
        accent: {
          DEFAULT: '#93C6D0',
          light: '#A8D4DC',
          dark: '#7BB8C4',
        },
        headline: '#D1E2E4',
        body: '#9BB5A9',
        meta: '#588E77',
        danger: '#FF0000',
      },
      fontFamily: {
        heading: ['"Share Tech Mono"', 'monospace'],
        body: ['"Share Tech Mono"', 'monospace'],
        mono: ['"Share Tech Mono"', 'monospace'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'float': 'float 6s ease-in-out infinite',
        'waveform': 'waveform 3s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(147,198,208,0.2), 0 0 10px rgba(147,198,208,0.1)' },
          '100%': { boxShadow: '0 0 15px rgba(147,198,208,0.4), 0 0 30px rgba(147,198,208,0.2)' },
        },
        'glow-pulse': {
          '0%, 100%': { textShadow: '0 0 5px #93C6D0, 0 0 10px #93C6D0' },
          '50%': { textShadow: '0 0 10px #93C6D0, 0 0 20px #93C6D0, 0 0 30px #93C6D0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.97' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        waveform: {
          '0%, 100%': { transform: 'scaleX(1)' },
          '50%': { transform: 'scaleX(1.05)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      textShadow: {
        'glow': '0 0 5px #93C6D0, 0 0 10px #93C6D0',
        'glow-lg': '0 0 10px #93C6D0, 0 0 20px #93C6D0, 0 0 30px #93C6D0',
        'glow-accent': '0 0 5px #93C6D0, 0 0 10px #93C6D0',
      },
    },
  },
  plugins: [],
};
