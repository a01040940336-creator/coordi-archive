/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        bodoni: ['"Bodoni Moda"', 'Georgia', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#111111',
        secondary: '#666666',
        border: '#EAEAEA',
        accent: '#C9A96E',
      },
      letterSpacing: {
        widest: '0.3em',
        editorial: '0.5em',
      },
    },
  },
  plugins: [],
}

