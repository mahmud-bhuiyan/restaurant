/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: "#1a1a1a",
          light: "#2d2d2d",
          dark: "#0f0f0f",
        },
        gold: {
          DEFAULT: "#c9a962",
          light: "#e0c989",
          dark: "#a88b4a",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      maxWidth: {
        content: "72rem",
      },
      boxShadow: {
        gold: "0 4px 24px rgba(201, 169, 98, 0.15)",
        card: "0 8px 32px rgba(0, 0, 0, 0.4)",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(to bottom, rgba(15,15,15,0.3) 0%, rgba(15,15,15,0.85) 60%, #1a1a1a 100%)",
        "gold-gradient": "linear-gradient(135deg, #c9a962 0%, #e0c989 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
