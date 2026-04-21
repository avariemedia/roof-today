"use client";

/**
 * Google Maps JavaScript API loader with Places library.
 * Loads the script once, returns a shared promise.
 * If NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set, resolves to null (graceful fallback).
 */

let loadingPromise: Promise<any> | null = null;

export function loadGoogleMaps(libraries: string[] = ["places"]): Promise<any> {
  if (typeof window === "undefined") return Promise.resolve(null);
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!key) return Promise.resolve(null);

  // Already loaded
  if ((window as any).google?.maps?.places) {
    return Promise.resolve((window as any).google);
  }

  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise((resolve, reject) => {
    const id = "google-maps-script";
    if (document.getElementById(id)) {
      // Script exists but not ready — wait for its load
      const existing = document.getElementById(id) as HTMLScriptElement;
      existing.addEventListener("load", () => resolve((window as any).google));
      existing.addEventListener("error", () => reject(new Error("Google Maps failed to load")));
      return;
    }
    const script = document.createElement("script");
    script.id = id;
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=${libraries.join(",")}&v=weekly&loading=async`;
    script.onload = () => resolve((window as any).google);
    script.onerror = () => reject(new Error("Google Maps failed to load"));
    document.head.appendChild(script);
  });

  return loadingPromise;
}
