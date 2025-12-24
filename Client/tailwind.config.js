// tailwind.config.js
const {heroui} = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // ...
    // make sure it's pointing to the ROOT node_module
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        '8xl': '88rem',   // Optional
        '9xl': '96rem',   // Optional
        '10xl': '104rem', // Add this
        '11xl': '112rem', // Add this
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};