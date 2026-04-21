"use client";

import { motion } from "framer-motion";

// Stylized, deterministic-looking roof facet diagram — no external assets required
export default function RoofDiagram({ seed = "sample" }: { seed?: string }) {
  // Simple hash for subtle variation per address
  const h = Array.from(seed).reduce((a, c) => a + c.charCodeAt(0), 0);
  const tilt = (h % 7) - 3; // -3..+3 degrees

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-ink-950 aerial-grid">
      {/* Simulated satellite gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-800 to-trust-900/60 mix-blend-multiply" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(42,92,219,0.25),transparent_55%)]" />

      <svg
        viewBox="0 0 400 300"
        className="absolute inset-0 w-full h-full"
        style={{ transform: `rotate(${tilt}deg) scale(1.02)` }}
      >
        <defs>
          <linearGradient id="facet" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(42,92,219,0.35)" />
            <stop offset="100%" stopColor="rgba(16,184,90,0.25)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>

        {/* Building footprint */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          d="M70 90 L330 90 L330 240 L70 240 Z"
          fill="url(#facet)"
          stroke="#34D076"
          strokeWidth="1.5"
          filter="url(#glow)"
        />

        {/* Ridge line */}
        <motion.line
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          x1="70" y1="165" x2="330" y2="165"
          stroke="#34D076"
          strokeWidth="1.8"
          strokeDasharray="4 3"
        />

        {/* Facet dividers */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          stroke="#6DE39B"
          strokeWidth="1"
        >
          <line x1="150" y1="90" x2="150" y2="240" />
          <line x1="250" y1="90" x2="250" y2="240" />
          <line x1="70" y1="130" x2="330" y2="130" />
          <line x1="70" y1="205" x2="330" y2="205" />
        </motion.g>

        {/* Vertex markers */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.3 }}
          fill="#34D076"
        >
          {[
            [70, 90], [150, 90], [250, 90], [330, 90],
            [70, 240], [150, 240], [250, 240], [330, 240],
            [200, 165],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="3.5" />
          ))}
        </motion.g>

        {/* North indicator */}
        <g transform="translate(355,30)">
          <circle r="14" fill="rgba(5,11,26,0.7)" stroke="#6DE39B" strokeWidth="1" />
          <text x="0" y="4" textAnchor="middle" fill="#D1FADF" fontSize="10" fontWeight="700">N</text>
        </g>
      </svg>

      {/* Scan line effect */}
      <motion.div
        initial={{ y: "-10%" }}
        animate={{ y: "110%" }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-go-400 to-transparent opacity-70"
      />
    </div>
  );
}
