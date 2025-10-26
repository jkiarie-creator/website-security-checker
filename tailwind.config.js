export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["'Orbitron'", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        inter: ["'Inter'", "system-ui", "sans-serif"],
      },
      colors: {
        // Semantic palette for a uniform UI across the app
        primary: {
          50: '#ecfeff',
          600: '#0891b2',
          700: '#065f73',
          800: '#074b57'
        },
        danger: {
          50: '#fff1f2',
          700: '#b91c1c'
        },
        warning: {
          50: '#fff7ed',
          700: '#c2410c'
        },
        success: {
          50: '#ecfdf5',
          700: '#047857'
        },
        muted: {
          200: '#e5e7eb',
          500: '#6b7280',
          700: '#374151'
        },
        card: '#ffffff',
        bg: '#f8fafc',

        // Preserve a few legacy dark colors used elsewhere
        darkPurple: '#15172A',
        darkBlue: '#0E0C2F',
        deepBlue: '#000439'
      },
    },
  },
  plugins: [],
}