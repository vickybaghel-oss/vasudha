import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        night: "var(--night)",
        heading: "var(--heading)",
        "heading-secondary": "var(--heading-secondary)",
        foreground: "var(--foreground)",
        accent: "var(--accent)",
      },
      fontFamily: {
        manrope: ["var(--font-manrope)", "sans-serif"],
        cormorant: ["var(--font-cormorant)", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
