/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'Noto Sans KR', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        playfair: ['Inter', 'Noto Sans KR', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        bodoni: ['Inter', 'Noto Sans KR', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        primary: '#111111',
        secondary: '#555555',
        border: '#E0E0DE',
        accent: '#C9A96E',
        canvas: '#F7F7F5',
      },
      letterSpacing: {
        widest: '0.3em',
        editorial: '0.5em',
      },
    },
  },
  plugins: [],
}

