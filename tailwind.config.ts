import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: { DEFAULT: "#1B4332", dark: "#143325", light: "#E4EDE6" },
        charcoal: "#24272B",
        steel: "#6E7B8B",
        light: "#F4F5F3",
        // legacy aliases — Phase 1 files use these, same values
        sand: "#F4F5F3",
        ink: "#24272B",
        stone2: "#6E7B8B",
        berry: { DEFAULT: "#1B4332", dark: "#143325", light: "#E4EDE6" }
      },
      fontFamily: {
        display: ["Sora", "Space Grotesk", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"]
      },
      borderRadius: { card: "12px" },
      boxShadow: { soft: "0 8px 30px rgba(0,0,0,.08)" }
    }
  },
  plugins: []
};

export default config;
