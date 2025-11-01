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
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#3b82f6',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
};
