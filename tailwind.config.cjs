/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '360px',
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
