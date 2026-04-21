"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin, ArrowRight } from "lucide-react";
import { loadGoogleMaps } from "@/lib/google-maps";

export default function AddressCapture({
  size = "lg",
  autoFocus = false,
  placeholder = "Start typing your address…",
}: {
  size?: "md" | "lg";
  autoFocus?: boolean;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<{
    formatted: string;
    lat: number;
    lng: number;
    placeId: string;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const acRef = useRef<any>(null);
  const router = useRouter();

  // Load Google Places Autocomplete on mount (if key is set)
  useEffect(() => {
    let mounted = true;
    loadGoogleMaps(["places"]).then((google) => {
      if (!mounted || !google || !inputRef.current) return;
      // Use the classic Autocomplete (widely supported)
      acRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ["address"],
        componentRestrictions: { country: ["us", "ca"] },
        fields: ["formatted_address", "geometry", "place_id"],
      });
      acRef.current.addListener("place_changed", () => {
        const place = acRef.current.getPlace();
        if (!place?.geometry?.location) return;
        const p = {
          formatted: place.formatted_address || "",
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          placeId: place.place_id || "",
        };
        setSelectedPlace(p);
        setValue(p.formatted);
      });
    });
    return () => { mounted = false; };
  }, []);

  const go = (addr: string, lat?: number, lng?: number, placeId?: string) => {
    const q = new URLSearchParams({ address: addr });
    if (lat && lng) { q.set("lat", String(lat)); q.set("lng", String(lng)); }
    if (placeId) q.set("placeId", placeId);
    router.push(`/report/preview?${q.toString()}`);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const addr = (selectedPlace?.formatted || value).trim();
    if (addr.length < 5) return;
    setLoading(true);
    if (selectedPlace) {
      go(addr, selectedPlace.lat, selectedPlace.lng, selectedPlace.placeId);
    } else {
      go(addr);
    }
  };

  const useMyLocation = () => {
    if (!("geolocation" in navigator)) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        go(`${lat.toFixed(5)}, ${lng.toFixed(5)}`, lat, lng);
      },
      () => setLoading(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const tall = size === "lg";

  return (
    <form onSubmit={onSubmit} className="w-full" id="address">
      <div
        className={`flex flex-col sm:flex-row sm:items-stretch rounded-2xl bg-white shadow-trust ring-1 ring-stone-200 overflow-hidden ${
          tall ? "p-1.5 gap-1.5 sm:gap-0" : "p-1 gap-1 sm:gap-0"
        }`}
      >
        <div className="flex items-center flex-1 min-w-0 px-2">
          <label className="flex items-center pr-1 text-stone-400 shrink-0" htmlFor="addr-input">
            <MapPin size={tall ? 22 : 18} />
          </label>
          <input
            ref={inputRef}
            id="addr-input"
            name="address"
            autoFocus={autoFocus}
            value={value}
            onChange={(e) => { setValue(e.target.value); setSelectedPlace(null); }}
            placeholder={placeholder}
            className={`flex-1 min-w-0 bg-transparent outline-none ${
              tall ? "text-base sm:text-lg py-3 px-2" : "text-base py-2 px-2"
            } text-ink-900 placeholder:text-stone-400`}
            autoComplete="street-address"
            inputMode="text"
            aria-label="Property address"
          />
        </div>
        <button
          type="submit"
          disabled={loading || (selectedPlace ? false : value.trim().length < 5)}
          className={`inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition shrink-0 whitespace-nowrap
            ${tall ? "px-5 py-3.5 text-base" : "px-4 py-2.5 text-sm"}
            bg-go-500 hover:bg-go-600 text-white shadow-go
            disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-ring`}
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Measure My Roof"}
          {!loading && <ArrowRight size={18} />}
        </button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
        <button
          type="button"
          onClick={useMyLocation}
          className="underline underline-offset-2 hover:text-ink-900"
        >
          Use my current location
        </button>
        <span>No credit card. No signup. Preview in 3 seconds.</span>
      </div>
    </form>
  );
}
