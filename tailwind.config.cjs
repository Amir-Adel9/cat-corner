/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '360px',
      },
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        content: 'var(--color-content)',
        inverseContent: 'var(--color-inverse-content)',
        constant: 'var(--color-constant)',
      },
      fontFamily: {
        sono: ['Sono'],
        tilt: ['Tilt Warp'],
        noto: ['Noto Sans JP'],
      },
    },
  },
  plugins: [],
};

module.exports = config;
