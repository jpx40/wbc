/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
  // mode: "jit",

  content: ["./src/**/*.{html, js, ts, vue}", "./src/**/*"],
  theme: {
    extend: {},
  },
  plugins: [],
  // presets: [require("@acmecorp/tailwind-base")],
};
