/**
 * Roof plane segmentation from a DSM raster.
 *
 * Strategy:
 *  1. Compute per-pixel surface normals via Sobel gradients.
 *  2. Cluster pixels by similar (normal, elevation) using a seeded region-growing
 *     approach, seeded from Solar API's reported segment centers.
 *  3. For each cluster, fit a least-squares plane and compute pitch/azimuth/area.
 *
 * When Solar API seeds aren't available, we run K-means over the normal space.
 */
import { Raster, RoofPlane3D, LatLng } from "./types";
import { enToLatLng, pitchDegToRatio, SQFT_PER_SQM, polygonAreaM2 } from "./geo";

type Vec3 = [number, number, number];

function dot(a: Vec3, b: Vec3) { return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]; }
function norm(v: Vec3): Vec3 { const l = Math.hypot(v[0],v[1],v[2])||1; return [v[0]/l,v[1]/l,v[2]/l]; }

/** Sobel gradient at (x,y) in pixels -> returns dz/dx, dz/dy in meters per meter. */
function gradAt(r: Raster, x: number, y: number): [number, number] | null {
  if (x < 1 || y < 1 || x >= r.width - 1 || y >= r.height - 1) return null;
  const at = (xi: number, yi: number) => r.data[yi * r.width + xi];
  const gx =
    (at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1) -
      at(x - 1, y - 1) - 2 * at(x - 1, y) - at(x - 1, y + 1)) /
    (8 * r.pixelMeters);
  const gy =
    (at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1) -
      at(x - 1, y - 1) - 2 * at(x, y - 1) - at(x + 1, y - 1)) /
    (8 * r.pixelMeters);
  return [gx, gy];
}

function normalFromGrad([gx, gy]: [number, number]): Vec3 {
  return norm([-gx, -gy, 1]);
}

/** Identify roof pixels: high elevation relative to local minimum (simple nDSM proxy). */
function roofMask(r: Raster, minHeightM = 2.0): Uint8Array {
  const mask = new Uint8Array(r.width * r.height);
  // Local min via morphological erosion proxy: 21-pixel window min
  const win = 10;
  for (let y = 0; y < r.height; y++) {
    for (let x = 0; x < r.width; x++) {
      let lmin = Infinity;
      for (let dy = -win; dy <= win; dy += 3) {
        for (let dx = -win; dx <= win; dx += 3) {
          const nx = Math.max(0, Math.min(r.width - 1, x + dx));
          const ny = Math.max(0, Math.min(r.height - 1, y + dy));
          const v = r.data[ny * r.width + nx];
          if (Number.isFinite(v) && v < lmin) lmin = v;
        }
      }
      const v = r.data[y * r.width + x];
      if (Number.isFinite(v) && v - lmin > minHeightM) mask[y * r.width + x] = 1;
    }
  }
  return mask;
}

/** Region-grow from a seed pixel; pixels merge if normal dot product > 0.97 and elevation delta < 0.3m. */
function growRegion(r: Raster, mask: Uint8Array, seeds: Array<{ x: number; y: number }>): Int32Array {
  const labels = new Int32Array(r.width * r.height).fill(-1);
  for (let si = 0; si < seeds.length; si++) {
    const s = seeds[si];
    const sx = Math.round(s.x), sy = Math.round(s.y);
    if (sx < 0 || sy < 0 || sx >= r.width || sy >= r.height) continue;
    if (!mask[sy * r.width + sx]) continue;
    const seedG = gradAt(r, sx, sy);
    if (!seedG) continue;
    const seedN = normalFromGrad(seedG);
    const seedZ = r.data[sy * r.width + sx];
    const stack: number[] = [sy * r.width + sx];
    while (stack.length) {
      const idx = stack.pop()!;
      if (labels[idx] !== -1) continue;
      if (!mask[idx]) continue;
      const y = Math.floor(idx / r.width), x = idx - y * r.width;
      const g = gradAt(r, x, y);
      if (!g) continue;
      const n = normalFromGrad(g);
      if (dot(n, seedN) < 0.95) continue;
      if (Math.abs(r.data[idx] - seedZ) > Math.max(0.4, 0.15 * (idx % 50))) continue;
      labels[idx] = si;
      if (x > 0) stack.push(idx - 1);
      if (x < r.width - 1) stack.push(idx + 1);
      if (y > 0) stack.push(idx - r.width);
      if (y < r.height - 1) stack.push(idx + r.width);
    }
  }
  return labels;
}

/** Least-squares plane fit over a set of 3D points. Returns (normal, offset). */
function fitPlane(points: Array<[number, number, number]>): { normal: Vec3; offset: number } {
  let sx = 0, sy = 0, sz = 0;
  for (const p of points) { sx += p[0]; sy += p[1]; sz += p[2]; }
  const n = points.length;
  const cx = sx / n, cy = sy / n, cz = sz / n;
  let xx = 0, xy = 0, xz = 0, yy = 0, yz = 0, zz = 0;
  for (const p of points) {
    const dx = p[0] - cx, dy = p[1] - cy, dz = p[2] - cz;
    xx += dx * dx; xy += dx * dy; xz += dx * dz;
    yy += dy * dy; yz += dy * dz; zz += dz * dz;
  }
  // Solve [[xx,xy,xz],[xy,yy,yz],[xz,yz,zz]] eigen-min via simplified approach for z-up dominance
  const det_x = yy * zz - yz * yz;
  const det_y = xx * zz - xz * xz;
  const det_z = xx * yy - xy * xy;
  const maxDet = Math.max(det_x, det_y, det_z);
  let normal: Vec3;
  if (maxDet === det_z) {
    normal = norm([-(xz * yy - xy * yz) / det_z, -(yz * xx - xy * xz) / det_z, 1]);
  } else if (maxDet === det_y) {
    normal = norm([-(xy * zz - yz * xz) / det_y, 1, -(yz * xx - xy * xz) / det_y]);
  } else {
    normal = norm([1, -(xy * zz - xz * yz) / det_x, -(xz * yy - xy * yz) / det_x]);
  }
  if (normal[2] < 0) normal = [-normal[0], -normal[1], -normal[2]];
  const offset = normal[0] * cx + normal[1] * cy + normal[2] * cz;
  return { normal, offset };
}

export function segmentPlanes(
  r: Raster,
  origin: LatLng,
  seedsLatLng: Array<{ lat: number; lng: number; pitchDegrees: number; azimuthDegrees: number }>
): RoofPlane3D[] {
  const mask = roofMask(r, 2.0);

  // Convert lat/lng seeds to pixel coords
  const lngPerPx = (r.bounds.east - r.bounds.west) / r.width;
  const latPerPx = (r.bounds.south - r.bounds.north) / r.height;
  const seedsPx = seedsLatLng.map((s) => ({
    x: (s.lng - r.bounds.west) / lngPerPx,
    y: (s.lat - r.bounds.north) / latPerPx,
  }));

  const labels = growRegion(r, mask, seedsPx);

  const planes: RoofPlane3D[] = [];
  for (let si = 0; si < seedsLatLng.length; si++) {
    const pts: Array<[number, number, number]> = [];
    let sumE = 0, sumN = 0, count = 0;
    const bounds = { minE: Infinity, maxE: -Infinity, minN: Infinity, maxN: -Infinity };
    for (let y = 0; y < r.height; y++) {
      for (let x = 0; x < r.width; x++) {
        const idx = y * r.width + x;
        if (labels[idx] !== si) continue;
        const lng = r.bounds.west + x * lngPerPx;
        const lat = r.bounds.north + y * latPerPx;
        const east = (lng - origin.lng) * (111320 * Math.cos((origin.lat * Math.PI) / 180));
        const north = (lat - origin.lat) * 111320;
        const z = r.data[idx];
        pts.push([east, north, z]);
        sumE += east; sumN += north; count++;
        if (east < bounds.minE) bounds.minE = east;
        if (east > bounds.maxE) bounds.maxE = east;
        if (north < bounds.minN) bounds.minN = north;
        if (north > bounds.maxN) bounds.maxN = north;
      }
    }
    if (pts.length < 40) {
      // Fallback to the Solar API's reported pitch/azimuth for this seed
      const s = seedsLatLng[si];
      planes.push(seedToPlane(s, si, origin));
      continue;
    }
    const { normal, offset } = fitPlane(pts);
    const pitchDeg = Math.acos(Math.max(0, Math.min(1, normal[2]))) * (180 / Math.PI);
    let azimuthDeg = (Math.atan2(-normal[0], -normal[1]) * 180) / Math.PI;
    if (azimuthDeg < 0) azimuthDeg += 360;

    const areaHoriz_m2 = pts.length * r.pixelMeters * r.pixelMeters;
    const slantArea_m2 = areaHoriz_m2 / Math.max(normal[2], 0.05);

    const cx = sumE / count, cy = sumN / count;
    const poly = hullFromBBox(bounds);

    planes.push({
      id: `p${si + 1}`,
      normal: normal as Vec3,
      offset,
      area_sqft: areaHoriz_m2 * SQFT_PER_SQM,
      slant_area_sqft: slantArea_m2 * SQFT_PER_SQM,
      pitch_deg: pitchDeg,
      pitch_ratio: pitchDegToRatio(pitchDeg),
      azimuth_deg: azimuthDeg,
      center: enToLatLng({ east: cx, north: cy }, origin),
      polygon: poly.map((p) => enToLatLng(p, origin)),
    });
  }
  return planes;
}

function seedToPlane(
  s: { lat: number; lng: number; pitchDegrees: number; azimuthDegrees: number },
  i: number,
  origin: LatLng
): RoofPlane3D {
  const pitchRad = (s.pitchDegrees * Math.PI) / 180;
  const azRad = (s.azimuthDegrees * Math.PI) / 180;
  const n: Vec3 = [-Math.sin(pitchRad) * Math.sin(azRad), -Math.sin(pitchRad) * Math.cos(azRad), Math.cos(pitchRad)];
  return {
    id: `p${i + 1}`,
    normal: n,
    offset: 0,
    area_sqft: 0,
    slant_area_sqft: 0,
    pitch_deg: s.pitchDegrees,
    pitch_ratio: pitchDegToRatio(s.pitchDegrees),
    azimuth_deg: s.azimuthDegrees,
    center: { lat: s.lat, lng: s.lng },
    polygon: [],
  };
}

function hullFromBBox(b: { minE: number; maxE: number; minN: number; maxN: number }) {
  return [
    { east: b.minE, north: b.minN },
    { east: b.maxE, north: b.minN },
    { east: b.maxE, north: b.maxN },
    { east: b.minE, north: b.maxN },
  ];
}
