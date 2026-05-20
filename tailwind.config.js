/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gunmetal: '#0A1229', // Dark mode background (Deep Navy)
        sand: '#EBF5FF',     // Light mode background (Sea Blue)
        olive: '#68a309',    // Primary action color
        khaki: '#FDE68A',    // Highlights
        targetred: '#6D1020', // New corporate red
        camogreen: '#0c8237', // Accents
        // Functional text/border colors (replacing gray)
        'soft-gunmetal': '#334155', // For light mode secondary text (Slate-700 equivalent but bluer)
        'soft-sand': '#E2E8F0',     // For dark mode secondary text
        'deep-red': '#4A0B16',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        tactical: ['Rajdhani', 'sans-serif'],
        stencil: ['Oswald', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
