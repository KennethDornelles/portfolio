/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
  ],
  darkMode: 'class', // Enable dark mode manually
  theme: {
    extend: {
      colors: {
        graphite: {
          50: '#f6f6f7',
          100: '#e3e3e6',
          200: '#c8c8cd',
          300: '#a4a4ac',
          400: '#7d7d89',
          500: '#62626e',
          600: '#4e4e58',
          700: '#3f3f46', // Deep Graphite
          800: '#27272a',
          900: '#18181b', // Darkest
          950: '#09090b',
        },
        'tech-blue': {
          DEFAULT: '#00f0ff', // Cyberpunk-like blue
          500: '#00f0ff',
          600: '#00cbe6',
          700: '#0095a8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
