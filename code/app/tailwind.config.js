/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      width: {
        '1/15': '6.6667%', 
        '1/18': '5.5556%',
        '8/9': '88.8889%'
      },
      keyframes: {
        popOut: {
          '0%': { opacity: 1, transform: 'scale(1)' },
          '100%': { opacity: 0, transform: 'scale(0)' },
        },
        popIn: {
          '0%': { opacity: 0, transform: 'scale(0.2)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        typing: {
          '0%': { width: '0ch' },
          '100%': { width: '100%' },
        },
      },
      animation: {
        popOut: 'popOut 0.2s ease-out',
        fadeOutUp: 'fadeOutUp 0.5s forwards',
        popIn: 'popIn 0.3s ease-out',
        typing: 'typing 2s steps(40, end) forwards',
      },
    },
  },
  variants: {
    extend: {
      width: ['group-hover'],
    },
  },
  plugins: [],
}
