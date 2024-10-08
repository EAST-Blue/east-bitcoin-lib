import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      "main-0": "rgba(var(--main-color-0), <alpha-value>)",
      "main-1": "rgba(var(--main-color-1), <alpha-value>)",
      "main-2": "rgba(var(--main-color-2), <alpha-value>)",
      "main-3": "rgba(var(--main-color-3), <alpha-value>)",
      "main-4": "rgba(var(--main-color-4), <alpha-value>)",
      "main-5": "rgba(var(--main-color-5), <alpha-value>)",
      "main-6": "rgba(var(--main-color-6), <alpha-value>)",
      "main-7": "rgba(var(--main-color-7), <alpha-value>)",
      "main-8": "rgba(var(--main-color-8), <alpha-value>)",
      "main-9": "rgba(var(--main-color-9), <alpha-value>)",
    },
    fontFamily: {
      title: ["Urbanist", "sans-serif"],
      body: ["Inter", "sans-serif"],
      code: ["Fira Mono", "monospace"],
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
