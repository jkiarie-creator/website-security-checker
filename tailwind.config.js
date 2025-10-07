export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["'Orbitron'", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        inter: ["'Inter'", "system-ui", "sans-serif"],
      },
      colors: {
        darkPurple: '#15172A',
        darkBlue: '#0E0C2F',
        deepBlue: '#000439'
      },
    },
  },
  plugins: [],
}