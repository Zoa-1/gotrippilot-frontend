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
          primary: '#2563EB',
          primaryDark: '#1D4ED8',
          primaryLight: '#DBEAFE',
          accent: '#10B981',
          accentDark: '#059669',
          accentLight: '#D1FAE5',
          dark: '#1E293B',
          gray: '#64748B',
          light: '#F8FAFC',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
