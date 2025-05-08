/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2f3136',
        secondary: '#202225',
        accent: '#7289da',
        contrast: '#ffffff',
        lightgray: '#b9bbbe',
        focusBorder: '#7a84ff',
        inputBg: '#272C32',
        one: {
          primaryNormal: '#8A8C8B',
          primaryDark: '#4D5350',
          secondaryNormal: '#6C6F6E',
          secondaryLight: '#E2E3E3',
        },
        facup: {
          primaryNormal: '#D01821',
          primaryDark: '#810006',
          secondaryNormal: '#A80911',
          secondaryLight: '#FB6D74',
        }
      },
    },
  },
  plugins: [],
}

