export function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  // Convert degrees to radians
  lat1 = lat1 * Math.PI / 180;
  lon1 = lon1 * Math.PI / 180;
  lat2 = lat2 * Math.PI / 180;
  lon2 = lon2 * Math.PI / 180;

  // Haversine formula
  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;

  const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Radius of Earth in kilometers (use 3959 for miles)
  //const R = 6371; // km
  const R = 3959; // mi
  const distance = R * c;

  return distance;
}

export function getSquareCorners(centerLat: number, centerLon: number, radiusMiles: number) {
  const milesPerDegreeLat = 69.0;
  const milesPerDegreeLon = 69.0 * Math.cos(centerLat * Math.PI / 180);

  const deltaLat = radiusMiles / milesPerDegreeLat;
  const deltaLon = radiusMiles / milesPerDegreeLon;

  return {
    topLeft: {
      lat: centerLat + deltaLat,
      lon: centerLon - deltaLon
    },
    topRight: {
      lat: centerLat + deltaLat,
      lon: centerLon + deltaLon
    },
    bottomLeft: {
      lat: centerLat - deltaLat,
      lon: centerLon - deltaLon
    },
    bottomRight: {
      lat: centerLat - deltaLat,
      lon: centerLon + deltaLon
    }
  };
}
