import { clsx, ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

/** Lightweight cookie-based session so reports can be attached to a buyer without a DB. */
export function makeSessionId() {
  return "sess_" + Math.random().toString(36).slice(2, 12);
}
