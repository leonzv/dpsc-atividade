/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      colors: {
        background: {
          DEFAULT: '#FFFFFF',
          light: '#F8FAFC'
        },
        accent: {
          DEFAULT: '#900020',
          hover: '#66001A'
        },
        surface: {
          DEFAULT: '#E2E8F0',
          hover: '#CBD5E1'
        },
        text: {
          DEFAULT: '#0F172A',
          primary: '#1A202C',
          secondary: '#334155',
          tertiary: '#64748B',
          inverted: '#FFFFFF'
        },
        border: {
          DEFAULT: '#E2E8F0',
          focus: '#DD6B88'
        }
      }
    },
  },
  plugins: [],
}
