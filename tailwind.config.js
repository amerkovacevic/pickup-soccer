/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],
      },
      colors: {
        pitch: {
          100: '#d1fae5',
          200: '#a7f3d0',
          500: '#10b981',
          700: '#047857',
        },
      },
    },
  },
  plugins: [],
};
