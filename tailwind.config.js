/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#9B7EBD',
        secondary: '#FFB5A7',
        accent: '#F4A261',
        surface: {
          50: '#FEFBF8',
          100: '#FFF5F0',
          200: '#F8F4F0',
          300: '#F0EBE5',
          400: '#E8E0D8',
          500: '#D4C4B8',
          600: '#C0A895',
          700: '#A68B75',
          800: '#8B6F58',
          900: '#6B543F'
        },
        success: '#7FB069',
        warning: '#F4A261',
        error: '#E76F51',
        info: '#6B9BD1'
      },
      fontFamily: { 
        sans: ['Nunito', 'ui-sans-serif', 'system-ui'], 
        heading: ['Quicksand', 'ui-sans-serif', 'system-ui'] 
      },
      borderRadius: {
        'card': '12px'
      },
      boxShadow: {
        'card': '0 4px 8px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 16px rgba(0, 0, 0, 0.15)'
      }
    },
  },
  plugins: [],
}