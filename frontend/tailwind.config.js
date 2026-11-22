/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: '#163A24',
        primary: '#2E7D32',
        leaf: '#4F8F3A',
        sage: '#A8C59A',
        cream: '#F7F5EA',
        warm: '#FCFCF8',
        soil: '#8B6B45',
        golden: '#D8A83E',
        dark: '#182019',
        muted: '#667064',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
