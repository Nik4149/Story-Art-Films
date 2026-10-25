/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary:   '#0a0908',
        secondary: '#141210',
        canvas:    '#1c1a17',
        light:     '#f5f3ef',
        warm:      '#ede9e1',
        accent:    '#c9a96e',
        stone:     '#2a2520',
        muted: {
          DEFAULT: '#7a766f',
          light:   '#b0a99e',
        },
      },
      letterSpacing: {
        ultra: '0.3em',
        mega:  '0.5em',
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        expo: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
