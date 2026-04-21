/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gunmetal: '#2a3439',
        olive: '#4b5320',
        khaki: '#c3b091',
        targetred: '#ff2400',
        camogreen: '#556b2f',
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
