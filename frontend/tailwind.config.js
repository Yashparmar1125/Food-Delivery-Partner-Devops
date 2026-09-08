/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        swiggy: {
          orange: '#FC8019',
          dark: '#E26802',
          light: '#FFF5ED',
          amber: '#F59E0B',
          glow: 'rgba(252, 128, 25, 0.25)',
        },
        zomato: {
          red: '#E23744',
          crimson: '#CB202D',
          dark: '#B01622',
          light: '#FFF0F2',
          glow: 'rgba(226, 55, 68, 0.25)',
        },
        brand: {
          dark: '#0F172A',
          card: '#1E293B',
          surface: '#0B1120',
          border: '#334155',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      }
    },
  },
  plugins: [],
}
