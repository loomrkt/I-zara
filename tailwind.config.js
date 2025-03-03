/** @type {import('tailwindcss').Config} */

const {addDynamicIconSelectors} = require("@iconify/tailwind");
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    './node_modules/preline/preline.js',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [
    require('preline/plugin'),
    addDynamicIconSelectors(),
  ],
}

