/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#030712',
          navy: '#0A192F',
          blue: '#1E3A8A',
          accent: '#3B82F6',
          light: '#F3F4F6',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'travel-gradient': 'linear-gradient(135deg, #0A192F 0%, #1E3A8A 50%, #3B82F6 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))',
      },
    },
  },
  plugins: [],
}
