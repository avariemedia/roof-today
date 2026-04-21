import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B1220",
          900: "#0B1220",
          700: "#1F2937",
          500: "#4B5563",
          300: "#9CA3AF",
        },
        paper: {
          DEFAULT: "#FAFAF9",
          50: "#FFFFFF",
          100: "#F5F5F3",
        },
        trust: { 50: "#EFF6FF", 500: "#2563EB", 600: "#1D4ED8", 700: "#1E3A8A" },
        accent: { 500: "#10B981", 600: "#059669" },
        signal: { amber: "#F59E0B", red: "#EF4444" },
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.04), 0 4px 20px rgba(16,24,40,0.06)",
        lift: "0 10px 40px rgba(16,24,40,0.10)",
      },
      borderRadius: { card: "20px" },
    },
  },
  plugins: [],
};
export default config;
