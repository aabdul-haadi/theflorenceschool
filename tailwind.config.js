/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f6ff',
          100: '#e0ecff',
          200: '#c0d8ff',
          300: '#91b8ff',
          400: '#608eff',
          500: '#3b64ff',
          600: '#1f3af5',
          700: '#1729e1',
          800: '#1823b6',
          900: '#1a2591',
          950: '#131754',
        },
      },
    },
  },
  plugins: [],
};