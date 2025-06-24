/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        calmBlue: {
          400: '#60a5fa', // azul claro
          500: '#3b82f6', // azul principal
          600: '#2563eb', // azul escuro
        },
      },
    },
  },
  plugins: [],
}

