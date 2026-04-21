import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.roof-today.com";

// Deterministic pseudo-random generator seeded by an address string.
// Used so every address produces a consistent, realistic-looking report.
export function seededRand(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return function () {
    h += 0x6D2B79F5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateMockReport(address: string) {
  const r = seededRand(address.toLowerCase().trim());
  const totalSquares = Math.round((18 + r() * 22) * 10) / 10; // 18.0 – 40.0
  const pitchOptions = ["4/12", "5/12", "6/12", "7/12", "8/12", "9/12"];
  const predominantPitch = pitchOptions[Math.floor(r() * pitchOptions.length)];
  const facetCount = 6 + Math.floor(r() * 8); // 6–13
  const ridgeLf = Math.round(40 + r() * 120);
  const hipLf = Math.round(20 + r() * 80);
  const valleyLf = Math.round(15 + r() * 70);
  const eaveLf = Math.round(80 + r() * 120);
  const rakeLf = Math.round(40 + r() * 80);
  const wasteFactor = Math.round((8 + r() * 7) * 10) / 10; // 8.0–15.0%
  const reportId = `RT-${Math.floor(r() * 9_000_000 + 1_000_000)}`;
  return {
    reportId,
    totalSquares,
    predominantPitch,
    facetCount,
    ridgeLf,
    hipLf,
    valleyLf,
    eaveLf,
    rakeLf,
    wasteFactor,
  };
}
