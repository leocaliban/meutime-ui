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
          primaryNormal: '#E7E7E7',
          primaryDark: '#8D8C8C',
          secondaryNormal: '#BABABA',
          secondaryLight: '#FFFFFF',
        },
        two: {
          primaryNormal: '#F4CCCC',
          primaryDark: '#B06767',
          secondaryNormal: '#D19797',
          secondaryLight: '#FFFBFB',
        },
        carabao: {
          primaryNormal: '#008E58',
          primaryDark: '#005837',
          secondaryNormal: '#007448',
          secondaryLight: '#37B082',
        },
        bsm: {
          primaryNormal: '#013E74',
          primaryDark: '#001D37',
          secondaryNormal: '#012F58',
          secondaryLight: '#045FB1',
        }
      },
    },
  },
  plugins: [],
}

