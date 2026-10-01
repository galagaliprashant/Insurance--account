/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ink: "#142019",
        paper: "#f5f6f3",
        accent: {
          DEFAULT: "#1f6f5c",
          soft: "#e3efe9",
        },
        verified: { DEFAULT: "#1a7f4b", bg: "#e7f6ee" },
        confirmed: { DEFAULT: "#2563a6", bg: "#e8f1fb" },
        needs: { DEFAULT: "#a8641a", bg: "#fbf0e0" },
        unknown: { DEFAULT: "#5b6570", bg: "#eef0f1" },
        notdetected: { DEFAULT: "#98a29b", bg: "#f2f4f1" },
      },
    },
  },
  plugins: [],
};
