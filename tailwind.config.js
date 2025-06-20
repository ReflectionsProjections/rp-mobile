/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './app/**/*.{js,jsx,ts,tsx}',
      './components/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
      extend: {
        fontFamily: {
          racing: ['RacingSansOne', 'System'],
          inter: ['Inter', 'System'],
        },
      },
    },
    plugins: [],
};
  