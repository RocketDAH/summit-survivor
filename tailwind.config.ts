import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        accent: "var(--color-accent)",
        positive: "var(--color-positive)",
        negative: "var(--color-negative)",
        random: "var(--color-random)",
      },
      fontFamily: {
        display: ["var(--font-display)", "monospace"],
        body: ["var(--font-body)", "monospace"],
        korean: ["var(--font-korean)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
