import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#0a1020",
        panel: "#111a30",
        card: "#17233f",
        accent: "#4ce0b3",
        accent2: "#65a7ff",
        warning: "#ffc857"
      },
      boxShadow: {
        glow: "0 0 40px rgba(76, 224, 179, 0.18)"
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
