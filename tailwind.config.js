/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "-apple-system", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      colors: {
        canvas: {
          950: "#000000",
          900: "#09090b",
          850: "#101014",
          800: "#18181b",
          750: "#222227",
          700: "#27272a",
        },
      },
    },
  },
  plugins: [],
};
