import { tailwindColors } from '../shared-design-tokens.js';

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
        ...tailwindColors,
        // Keep pitch color for soccer-specific elements (using tertiary from palette)
        pitch: {
          100: tailwindColors.tertiary[100],
          200: tailwindColors.tertiary[200],
          300: tailwindColors.tertiary[300],
          400: tailwindColors.tertiary[400],
          500: tailwindColors.tertiary[500],
          600: tailwindColors.tertiary[600],
          700: tailwindColors.tertiary[700],
        },
      },
    },
  },
  plugins: [],
};
