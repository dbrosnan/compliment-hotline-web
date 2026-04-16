import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}", "./remotion/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#0B0820",
        velvet: "#1A1040",
        chrome: "#2D1B5E",
        coral: "#FF5E6C",
        citrus: "#FFD23F",
        mint: "#6EF7C4",
        magenta: "#E94BD6",
        cream: "#FCE8C8",
      },
      fontFamily: {
        display: ['"Monoton"', "cursive"],
        body: ['"Space Grotesk"', "ui-sans-serif", "system-ui"],
        serif: ['"Fraunces"', "Georgia", "serif"],
      },
      fontSize: {
        hero: ["6.5rem", { lineHeight: "1", letterSpacing: "0.04em" }],
      },
      boxShadow: {
        neon: "0 0 30px rgba(233,75,214,0.35), 0 0 60px rgba(110,247,196,0.15)",
        glow: "0 0 0 1px rgba(252,232,200,0.15), 0 20px 60px -10px rgba(255,94,108,0.35)",
      },
      animation: {
        spin12: "spin 8s linear infinite",
        spinSlow: "spin 24s linear infinite",
        ring: "ring 4s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
        pulseDot: "pulseDot 1.4s ease-in-out infinite",
      },
      keyframes: {
        ring: {
          "0%, 92%, 100%": { transform: "rotate(0deg)" },
          "94%": { transform: "rotate(-3deg)" },
          "96%": { transform: "rotate(3deg)" },
          "98%": { transform: "rotate(-1.5deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseDot: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.9" },
          "50%": { transform: "scale(1.35)", opacity: "0.4" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
