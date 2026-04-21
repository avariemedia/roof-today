import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Trust-building palette: deep blue authority + action green
        ink: {
          950: "#050B1A",
          900: "#0A1428",
          800: "#111E3A",
          700: "#1B2B4E",
        },
        trust: {
          50: "#EEF4FF",
          100: "#D9E6FF",
          200: "#B0C7FF",
          300: "#7FA2F7",
          400: "#4D7DEA",
          500: "#2A5CDB",
          600: "#1E47B8",
          700: "#173792",
          800: "#112A70",
          900: "#0B1D55",
        },
        go: {
          50: "#ECFDF5",
          100: "#D1FADF",
          200: "#A5F0C2",
          300: "#6DE39B",
          400: "#34D076",
          500: "#10B85A",
          600: "#059447",
          700: "#046F38",
          800: "#05552C",
          900: "#034322",
        },
        stone: {
          50: "#F7F9FC",
          100: "#EDF1F7",
          200: "#DCE3EE",
          300: "#BAC5D6",
          400: "#8A98B0",
          500: "#5B6A84",
          600: "#3F4C66",
          700: "#2A3650",
          800: "#1A2339",
          900: "#0F1628",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.75rem, 6vw, 5rem)", { lineHeight: "1.02", letterSpacing: "-0.03em", fontWeight: "800" }],
        "display-lg": ["clamp(2.25rem, 4.5vw, 3.75rem)", { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "800" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
      },
      boxShadow: {
        "trust": "0 8px 30px -8px rgba(23, 55, 146, 0.35)",
        "go": "0 10px 30px -10px rgba(16, 184, 90, 0.55)",
        "card": "0 1px 3px rgba(15, 22, 40, 0.06), 0 8px 24px -6px rgba(15, 22, 40, 0.08)",
        "ring-go": "0 0 0 4px rgba(52, 208, 118, 0.25)",
      },
      animation: {
        "shimmer": "shimmer 2.2s linear infinite",
        "count-up": "countUp 1s ease-out",
        "pulse-ring": "pulseRing 2s ease-out infinite",
        "fade-up": "fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        countUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseRing: {
          "0%": { boxShadow: "0 0 0 0 rgba(52, 208, 118, 0.6)" },
          "70%": { boxShadow: "0 0 0 16px rgba(52, 208, 118, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(52, 208, 118, 0)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
