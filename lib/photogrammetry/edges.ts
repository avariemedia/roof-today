/**
 * Edge classification from 3D plane geometry.
 * For every pair of planes, compute their line of intersection in 3D and classify as
 * ridge, hip, or valley by pitch sign. Edges adjacent to the footprint boundary (no shared plane)
 * are classified as eave (horizontal) or rake (sloped).
 */
import { RoofPlane3D, RoofEdge, LatLng } from "./types";
import { FT_PER_M, latLngToEN, enToLatLng, distEN } from "./geo";

function cross(a: [number, number, number], b: [number, number, number]): [number, number, number] {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

/** Intersection line of two planes: returns direction vector + a point on the line, or null if parallel. */
function planeIntersection(p1: RoofPlane3D, p2: RoofPlane3D) {
  const d = cross(p1.normal, p2.normal);
  const mag = Math.hypot(d[0], d[1], d[2]);
  if (mag < 1e-4) return null;
  // Solve for a point: set z = 0 and solve 2x2
  const [a1, b1] = [p1.normal[0], p1.normal[1]];
  const [a2, b2] = [p2.normal[0], p2.normal[1]];
  const det = a1 * b2 - a2 * b1;
  if (Math.abs(det) < 1e-6) return null;
  const x = (b2 * p1.offset - b1 * p2.offset) / det;
  const y = (a1 * p2.offset - a2 * p1.offset) / det;
  return { dir: d.map((v) => v / mag) as [number, number, number], point: [x, y, 0] as [number, number, number] };
}

/** Classify a shared-edge line between two planes. */
function classifyShared(p1: RoofPlane3D, p2: RoofPlane3D, lineDir: [number, number, number]): "ridge" | "hip" | "valley" {
  const horizontal = Math.abs(lineDir[2]) < 0.05;
  const avgN: [number, number, number] = [
    (p1.normal[0] + p2.normal[0]) / 2,
    (p1.normal[1] + p2.normal[1]) / 2,
    (p1.normal[2] + p2.normal[2]) / 2,
  ];
  const pointUp = avgN[2] > 0.985;
  if (horizontal && pointUp) return "ridge";
  const cx1 = (p1.normal[0]) * -1, cy1 = (p1.normal[1]) * -1;
  const cx2 = (p2.normal[0]) * -1, cy2 = (p2.normal[1]) * -1;
  const facingOut = cx1 * cx2 + cy1 * cy2;
  if (facingOut < -0.3) return "valley";
  return "hip";
}

/** Determine whether two planes' projected footprints are adjacent. */
function planesAdjacent(p1: RoofPlane3D, p2: RoofPlane3D, origin: LatLng): boolean {
  if (!p1.polygon.length || !p2.polygon.length) return false;
  // If plane bounding boxes overlap OR centers within 15m, treat as adjacent
  const c1 = latLngToEN(p1.center, origin);
  const c2 = latLngToEN(p2.center, origin);
  return distEN(c1, c2) < 20;
}

export function classifyEdges(planes: RoofPlane3D[], origin: LatLng): RoofEdge[] {
  const edges: RoofEdge[] = [];
  for (let i = 0; i < planes.length; i++) {
    for (let j = i + 1; j < planes.length; j++) {
      const p1 = planes[i], p2 = planes[j];
      if (!planesAdjacent(p1, p2, origin)) continue;
      const isect = planeIntersection(p1, p2);
      if (!isect) continue;
      const type = classifyShared(p1, p2, isect.dir);
      // Estimate edge length from overlap of plane bounding polygons
      const c1 = latLngToEN(p1.center, origin);
      const c2 = latLngToEN(p2.center, origin);
      const length_m = Math.min(
        Math.sqrt(p1.area_sqft / 10.7639) * 0.9,
        Math.sqrt(p2.area_sqft / 10.7639) * 0.9
      );
      const mid = { east: (c1.east + c2.east) / 2, north: (c1.north + c2.north) / 2 };
      const perp: [number, number] = [-isect.dir[1], isect.dir[0]];
      const half_m = length_m / 2;
      const a = { east: mid.east + perp[0] * half_m, north: mid.north + perp[1] * half_m };
      const b = { east: mid.east - perp[0] * half_m, north: mid.north - perp[1] * half_m };
      edges.push({
        type,
        length_ft: length_m * FT_PER_M,
        planeIds: [p1.id, p2.id],
        line: [enToLatLng(a, origin), enToLatLng(b, origin)],
      });
    }
  }
  // Eaves and rakes from plane perimeters minus shared edges (approximate by perimeter residual)
  for (const p of planes) {
    if (p.polygon.length < 3) continue;
    let perim_m = 0;
    for (let i = 0; i < p.polygon.length; i++) {
      const a = latLngToEN(p.polygon[i], origin);
      const b = latLngToEN(p.polygon[(i + 1) % p.polygon.length], origin);
      perim_m += distEN(a, b);
    }
    const sharedFt = edges
      .filter((e) => e.planeIds[0] === p.id || e.planeIds[1] === p.id)
      .reduce((s, e) => s + e.length_ft, 0);
    const residualFt = Math.max(0, perim_m * FT_PER_M - sharedFt);
    // Low side -> eave, high side -> rake; distribute by pitch
    const rakeShare = Math.min(0.5, p.pitch_deg / 90);
    const eaveLf = residualFt * (1 - rakeShare);
    const rakeLf = residualFt * rakeShare;
    if (eaveLf > 0.5) {
      edges.push({ type: "eave", length_ft: eaveLf, planeIds: [p.id, null], line: [p.center, p.center] });
    }
    if (rakeLf > 0.5) {
      edges.push({ type: "rake", length_ft: rakeLf, planeIds: [p.id, null], line: [p.center, p.center] });
    }
  }
  return edges;
}

export function sumByType(edges: RoofEdge[]) {
  const r = { ridge: 0, hip: 0, valley: 0, eave: 0, rake: 0, total: 0 };
  for (const e of edges) { r[e.type] += e.length_ft; r.total += e.length_ft; }
  return r;
}
