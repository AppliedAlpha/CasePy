/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      animation: {
        'toast-in':  'toastIn 0.28s ease-out',
        'toast-out': 'toastOut 0.22s ease-in forwards',
      },
      keyframes: {
        toastIn: {
          '0%':   { transform: 'translateX(110%)', opacity: '0' },
          '100%': { transform: 'translateX(0)',    opacity: '1' },
        },
        toastOut: {
          '0%':   { transform: 'translateX(0)',    opacity: '1' },
          '100%': { transform: 'translateX(110%)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
