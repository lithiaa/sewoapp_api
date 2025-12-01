function applyRealisticFloor(distanceKm: number) {
  const MIN_DISTANCE = 0.09;

  if (distanceKm < MIN_DISTANCE) {
    return MIN_DISTANCE;
  }

  return distanceKm;
}

function realisticMultiplier(distanceKm: number) {
  if (distanceKm < 1) return 1.8;
  if (distanceKm < 5) return 1.4;
  if (distanceKm < 20) return 1.2;
  return 1.1;
}

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightKm = R * c;

  const multi = realisticMultiplier(straightKm);
  const adjusted = straightKm * multi;

  const realistic = applyRealisticFloor(adjusted);

  return Number(realistic.toFixed(2));
}
