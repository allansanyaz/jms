/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      serif: ['Lora', ...defaultTheme.fontFamily.serif],
      mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      sega: ['"SEGA LOGO FONT"', ...defaultTheme.fontFamily.sans],
    },
    extend: {
      colors: {
        'primary': '#605568ff',
        'secondary': '#382B42ff',
        'tertiary': '#6A207Fff'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
      require('@tailwindcss/forms'),
  ],
}
