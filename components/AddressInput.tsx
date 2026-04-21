"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    google?: any;
  }
}

type Props = { autoFocus?: boolean; size?: "lg" | "md" };

export default function AddressInput({ autoFocus = true, size = "lg" }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const autoRef = useRef<any>(null);
  const [value, setValue] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let tries = 0;
    const id = setInterval(() => {
      tries++;
      if (window.google?.maps?.places && inputRef.current && !autoRef.current) {
        autoRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ["address"],
          componentRestrictions: { country: ["us", "ca"] },
          fields: ["formatted_address", "geometry.location", "place_id"],
        });
        autoRef.current.addListener("place_changed", () => {
          const place = autoRef.current.getPlace();
          const loc = place?.geometry?.location;
          if (!loc) return;
          go(loc.lat(), loc.lng(), place.formatted_address, place.place_id);
        });
        setReady(true);
        clearInterval(id);
      } else if (tries > 40) {
        // Maps didn't load — fall back to manual submit (geocode server-side)
        setReady(true);
        clearInterval(id);
      }
    }, 150);
    return () => clearInterval(id);
  }, []);

  function go(lat: number, lng: number, formatted?: string, placeId?: string) {
    const q = new URLSearchParams({ lat: String(lat), lng: String(lng) });
    if (formatted) q.set("address", formatted);
    if (placeId) q.set("placeId", placeId);
    router.push(`/report?${q.toString()}`);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/geocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: value }),
      });
      const data = await res.json();
      if (data?.lat && data?.lng) {
        go(data.lat, data.lng, data.formatted, data.placeId);
      } else {
        alert("Could not locate that address. Try a different format.");
        setLoading(false);
      }
    } catch {
      alert("Network error geocoding address.");
      setLoading(false);
    }
  }

  const isLg = size === "lg";

  return (
    <form onSubmit={onSubmit} className="w-full">
      <label
        className={cn(
          "group flex items-center gap-3 rounded-2xl bg-white border hairline shadow-[0_1px_0_rgba(0,0,0,0.02),0_30px_60px_-30px_rgba(11,15,20,0.25)]",
          "focus-within:ring-2 focus-within:ring-ink/10 focus-within:border-ink/20 transition-all",
          isLg ? "px-5 py-4" : "px-4 py-3",
        )}
      >
        <MapPin className={cn("shrink-0 text-ink/40", isLg ? "w-5 h-5" : "w-4 h-4")} />
        <input
          ref={inputRef}
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter a property address"
          className={cn(
            "w-full bg-transparent outline-none placeholder:text-ink/30",
            isLg ? "text-lg" : "text-base",
          )}
          autoComplete="off"
          inputMode="search"
        />
        <button
          type="submit"
          disabled={loading || !ready}
          className={cn(
            "shrink-0 flex items-center gap-1.5 rounded-xl bg-ink text-paper font-medium hover:bg-ink/90 disabled:opacity-40 transition-all",
            isLg ? "px-4 py-2.5 text-sm" : "px-3 py-2 text-sm",
          )}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          <span className="hidden sm:inline">Measure</span>
        </button>
      </label>
      {!ready && <p className="mt-2 text-xs text-ink/40">Loading address lookup…</p>}
    </form>
  );
}
