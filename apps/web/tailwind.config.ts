import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        paper: "#f8fafc",
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          500: "#4f46e5",
          600: "#4338ca",
          700: "#3730a3",
        },
        verified: "#15803d",
        userconfirmed: "#0369a1",
        needsverification: "#b45309",
        unknown: "#64748b",
        notdetected: "#94a3b8",
      },
    },
  },
  plugins: [],
};

export default config;
