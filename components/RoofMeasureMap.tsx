"use client";

import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "@/lib/google-maps";
import { Crosshair, Loader2, MapPin, CheckCircle2 } from "lucide-react";

type Plane = {
  id: string;
  pitch_ratio: string;
  azimuth_deg: number;
  polygon?: { lat: number; lng: number }[];
  center: { lat: number; lng: number };
  area_sqft: number;
  slant_area_sqft: number;
};

type Props = {
  lat: number;
  lng: number;
  planes: Plane[];
  onPinDrop?: (pos: { lat: number; lng: number }) => void;
  onPlaneClick?: (plane: Plane) => void;
  selectedPlaneId?: string | null;
  height?: string;
};

export default function RoofMeasureMap({
  lat,
  lng,
  planes,
  onPinDrop,
  onPlaneClick,
  selectedPlaneId,
  height = "420px",
}: Props) {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const polyRefs = useRef<Map<string, any>>(new Map());
  const pinRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [hasKey, setHasKey] = useState(true);

  // Init map
  useEffect(() => {
    let mounted = true;
    loadGoogleMaps(["places"]).then((google) => {
      if (!mounted || !mapEl.current) return;
      if (!google) { setHasKey(false); return; }

      const map = new google.maps.Map(mapEl.current, {
        center: { lat, lng },
        zoom: 20,
        mapTypeId: "satellite",
        tilt: 0,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "greedy",
        streetViewControl: false,
        fullscreenControl: false,
        rotateControl: false,
      });
      mapRef.current = map;

      // Drop-pin on click
      map.addListener("click", (e: any) => {
        const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        if (pinRef.current) pinRef.current.setMap(null);
        pinRef.current = new google.maps.Marker({
          position: pos,
          map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#10B85A",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3,
          },
        });
        onPinDrop?.(pos);
      });

      setReady(true);
    });
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-center when lat/lng changes
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setCenter({ lat, lng });
  }, [lat, lng]);

  // Render roof plane polygons
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const google = (window as any).google;
    if (!google) return;

    // Clear existing
    polyRefs.current.forEach((p) => p.setMap(null));
    polyRefs.current.clear();

    planes.forEach((plane) => {
      if (!plane.polygon || plane.polygon.length < 3) return;
      const isSelected = plane.id === selectedPlaneId;
      const poly = new google.maps.Polygon({
        paths: plane.polygon,
        strokeColor: isSelected ? "#10B85A" : "#2A5CDB",
        strokeOpacity: 1,
        strokeWeight: isSelected ? 3 : 2,
        fillColor: isSelected ? "#10B85A" : "#2A5CDB",
        fillOpacity: isSelected ? 0.35 : 0.2,
        map: mapRef.current,
        clickable: true,
      });
      poly.addListener("click", () => onPlaneClick?.(plane));
      polyRefs.current.set(plane.id, poly);
    });
  }, [planes, ready, selectedPlaneId, onPlaneClick]);

  if (!hasKey) {
    return (
      <div
        className="rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-500 text-sm"
        style={{ height }}
      >
        <div className="text-center px-4">
          <MapPin className="mx-auto text-stone-400 mb-2" size={28} />
          <div>Satellite view requires Google Maps key.</div>
          <div className="text-xs mt-1 text-stone-400">(Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden border border-stone-200" style={{ height }}>
      <div ref={mapEl} className="absolute inset-0" />
      {!ready && (
        <div className="absolute inset-0 bg-ink-950/70 flex items-center justify-center text-white">
          <Loader2 className="animate-spin mr-2" size={20} /> Loading aerial view…
        </div>
      )}
      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-3 py-2 rounded-lg shadow-card text-xs text-stone-700 flex items-center gap-2">
        <Crosshair size={14} className="text-go-600" />
        Tap anywhere on the roof to confirm the home
      </div>
    </div>
  );
}
