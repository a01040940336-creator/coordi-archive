/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        bodoni: ['"Bodoni Moda"', 'Georgia', 'serif'],
        inter: ['Pretendard Variable', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        primary: '#111111',
        secondary: '#666666',
        border: '#E8E8E6',
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

