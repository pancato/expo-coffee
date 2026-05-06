import type { ShopCandidate } from "./types";

const OVERPASS_ENDPOINT = "https://overpass-api.de/api/interpreter";

type OverpassElement = {
  id: number;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags?: {
    name?: string;
    "name:en"?: string;
    amenity?: string;
    shop?: string;
  };
};

function distanceMeters(from: { latitude: number; longitude: number }, to: { latitude: number; longitude: number }) {
  const radius = 6371000;
  const lat1 = (from.latitude * Math.PI) / 180;
  const lat2 = (to.latitude * Math.PI) / 180;
  const dLat = ((to.latitude - from.latitude) * Math.PI) / 180;
  const dLon = ((to.longitude - from.longitude) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function fetchNearbyShops({
  latitude,
  longitude,
  city,
  radius = 900,
}: {
  latitude: number;
  longitude: number;
  city?: string;
  radius?: number;
}): Promise<ShopCandidate[]> {
  const query = `
    [out:json][timeout:8];
    (
      node["amenity"~"cafe|restaurant|bar|fast_food"](around:${radius},${latitude},${longitude});
      way["amenity"~"cafe|restaurant|bar|fast_food"](around:${radius},${latitude},${longitude});
      node["shop"](around:${radius},${latitude},${longitude});
      way["shop"](around:${radius},${latitude},${longitude});
    );
    out center tags 24;
  `;
  // Real nearby shops are fetched from OpenStreetMap through Overpass.
  // This keeps the prototype keyless; production builds can swap this boundary for AMap or Google Places.
  const response = await fetch(OVERPASS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!response.ok) throw new Error(`Overpass request failed: ${response.status}`);

  const data = (await response.json()) as { elements?: OverpassElement[] };
  const seen = new Set<string>();

  const candidates: ShopCandidate[] = [];

  for (const element of data.elements ?? []) {
    const name = element.tags?.name || element.tags?.["name:en"];
    const lat = element.lat ?? element.center?.lat;
    const lon = element.lon ?? element.center?.lon;
    if (!name || lat == null || lon == null) continue;

    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    candidates.push({
      id: `${element.id}`,
      name,
      city,
      latitude: lat,
      longitude: lon,
      distanceMeters: Math.round(distanceMeters({ latitude, longitude }, { latitude: lat, longitude: lon })),
    });
  }

  return candidates
    .sort((a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0))
    .slice(0, 12);
}
