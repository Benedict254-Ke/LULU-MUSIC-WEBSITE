/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neonBlue: "#0ff",       // Neon blue for buttons and highlights
        darkBg: "#0a0a0a",      // Dark background
        warmGold: "#f5a623",    // Warm African gold
        warmRed: "#d64545",     // Warm African red
      },
      fontFamily: {
        heading: ["'Poppins', sans-serif"],
        body: ["'Roboto', sans-serif"],
      },
    },
  },
  plugins: [],
};
