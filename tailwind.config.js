/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stonehill: {
          purple: {
            DEFAULT: '#2F2975',
            light: '#433BA8',
            dark: '#1E1A4A',
          },
          gold: {
            DEFAULT: '#C79900',
            light: '#F5BC00',
            dark: '#947200',
          },
        },
        primary: {
          DEFAULT: '#2F2975',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#C79900',
          foreground: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
