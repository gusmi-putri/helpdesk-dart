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
        gunmetal: '#1E293B', // softer, elegant dark slate instead of muddy gray
        sand: '#F5F0E6',     // Light mode background (Tactical Document)
        olive: '#68a309ff',    // much brighter tactical green, high readability
        khaki: '#FDE68A',    // clearer bright sand
        targetred: '#e12323ff', // balanced red with good visibility
        camogreen: '#0c8237ff', // bright soft green for accents
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
