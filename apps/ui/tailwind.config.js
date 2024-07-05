/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "white-1": `rgba(255,255,255,0.1)`,
        "white-2": `rgba(255,255,255,0.2)`,
        "white-3": `rgba(255,255,255,0.3)`,
        "white-4": `rgba(255,255,255,0.4)`,
        "white-5": `rgba(255,255,255,0.5)`,
        "white-6": `rgba(255,255,255,0.6)`,
        "white-7": `rgba(255,255,255,0.7)`,
        "white-8": `rgba(255,255,255,0.8)`,
        "white-9": `rgba(255,255,255,0.9)`,
        "black-1": "#191919",
        "black-2": "#303030",
      },
      fontFamily: {
        code: ['Fira Code', 'monospace']
      }
    },
  },
  plugins: [require("@tailwindcss/forms")],
}