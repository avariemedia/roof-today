"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, MapPin, ArrowRight } from "lucide-react";

export default function AddressCapture({
  size = "lg",
  autoFocus = false,
  placeholder = "Enter any U.S. address…",
}: {
  size?: "md" | "lg";
  autoFocus?: boolean;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const addr = value.trim();
    if (addr.length < 5) return;
    setLoading(true);
    router.push(`/report/preview?address=${encodeURIComponent(addr)}`);
  };

  const useMyLocation = () => {
    if (!("geolocation" in navigator)) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
        router.push(`/report/preview?address=${encodeURIComponent(coords)}`);
      },
      () => setLoading(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const tall = size === "lg";

  return (
    <form onSubmit={onSubmit} className="w-full" id="address">
      {/* Stacked on mobile, inline on sm+ */}
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
            id="addr-input"
            name="address"
            autoFocus={autoFocus}
            value={value}
            onChange={(e) => setValue(e.target.value)}
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
          disabled={loading || value.trim().length < 5}
          className={`inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition shrink-0 whitespace-nowrap
            ${tall ? "px-5 py-3.5 text-base" : "px-4 py-2.5 text-sm"}
            bg-go-500 hover:bg-go-600 text-white shadow-go
            disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-ring`}
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Generate Free Preview"}
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
