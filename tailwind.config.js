const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
        display: ["var(--font-space)", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand: {
          DEFAULT: "#2563eb",
          accent: "#9333ea",
          ink: "#0f172a",
        },
      },
      boxShadow: {
        card: "0 20px 45px rgba(15, 23, 42, 0.12)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

