export const M_PER_FT = 0.3048;
export const FT_PER_M = 1 / M_PER_FT;
export const SQFT_PER_SQM = 1 / (M_PER_FT * M_PER_FT);
export const M_PER_DEG_LAT = 111_320;

export const mPerDegLng = (lat: number) =>
  M_PER_DEG_LAT * Math.cos((lat * Math.PI) / 180);

export function latLngToEN(p: { lat: number; lng: number }, origin: { lat: number; lng: number }) {
  return {
    east: (p.lng - origin.lng) * mPerDegLng(origin.lat),
    north: (p.lat - origin.lat) * M_PER_DEG_LAT,
  };
}

export function enToLatLng(p: { east: number; north: number }, origin: { lat: number; lng: number }) {
  return {
    lat: origin.lat + p.north / M_PER_DEG_LAT,
    lng: origin.lng + p.east / mPerDegLng(origin.lat),
  };
}

export function pitchDegToRatio(deg: number): string {
  if (deg < 0) deg = 0;
  const x = Math.round(12 * Math.tan((deg * Math.PI) / 180));
  return `${Math.max(0, Math.min(24, x))}/12`;
}

export function polygonAreaM2(ring: { east: number; north: number }[]): number {
  let s = 0;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i];
    const b = ring[(i + 1) % ring.length];
    s += a.east * b.north - b.east * a.north;
  }
  return Math.abs(s) / 2;
}

export function distEN(a: { east: number; north: number }, b: { east: number; north: number }) {
  const de = a.east - b.east;
  const dn = a.north - b.north;
  return Math.sqrt(de * de + dn * dn);
}
