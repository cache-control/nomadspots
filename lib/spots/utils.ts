import { LngLat } from "maplibre-gl"
import type {
  FreeCampsite,
  IOverlander,
  RecreationGov,
  Spot,
  SquareCorners
} from "@/lib/spots/types";

export type FetchSource = "fcs" | "iol" | "recgov" | "spots";

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

export function getSquareCorners(centerLat: number, centerLon: number, radiusMiles: number): SquareCorners {
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

export const fetchSpots = async (pos: LngLat, src: FetchSource) => {
  const uri = `/api/spots?lat=${pos.lat}&lng=${pos.lng}`;
  const spots: Spot[] = [];

  if (src === "fcs") {
    try {
      const resp = await fetch(uri + "&src=fcs");
      const fcsJson = await resp.json();
      fcsJson.resultList.forEach((fcs: FreeCampsite) => spots.push({
        _id: "fcs-" + fcs.id,
        lat: fcs.latitude,
        lon: fcs.longitude,
        name: fcs.name,
        description: fcs.excerpt,
        type: fcs.type,
        url: fcs.url.trim(),
        fee: fcs.type_specific.fee,
        src: "fcs",
        org: "Unknown",
        ratings_count: fcs.ratings_count,
        ratings_value: fcs.ratings_value,
      }))
    } catch { }
  }

  if (src === "iol") {
    try {
      const resp = await fetch(uri + "&src=iol");
      const iolJson = await resp.json();
      iolJson.forEach((iol: IOverlander) => spots.push({
        _id: "iol-" + iol.guid,
        lat: iol.location.latitude,
        lon: iol.location.longitude,
        name: iol.name,
        description: iol.description,
        type: iol.category,
        url: "https://ioverlander.com/places/" + iol.guid,
        fee: "Unknown",
        src: "iol",
        org: iol.name.includes("BLM") ? "BLM"
          : (iol.name.includes("National Forest") ? "USFS" : "Unknown"),
        ratings_count: 0,
        ratings_value: 0,
      }))
    } catch { }
  }

  if (src === "recgov") {
    try {
      const sq = getSquareCorners(pos.lat, pos.lng, 100);
      const url = "https://www.recreation.gov/api/search/geo?exact=false"
        + `&lat_sw=${sq.bottomLeft.lat}&lng_sw=${sq.bottomLeft.lon}`
        + `&lat_ne=${sq.topRight.lat}&lng_ne=${sq.topRight.lon}`
        + "&size=200&fq=-entity_type%3A(tour%20OR%20timedentry_tour)&fg=camping&sort=available&start=0"
      const resp = await fetch(url);
      const json = await resp.json();

      json.results?.map((camp: RecreationGov) => spots.push({
        _id: "recgov-" + camp.id,
        lat: parseFloat(camp.latitude),
        lon: parseFloat(camp.longitude),
        name: camp.name,
        description: camp.description,
        type: camp.entity_type === "campground" ? "campsite" : camp.entity_type,
        url: "https://www.recreation.gov/camping/campgrounds/" + camp.entity_id,
        fee: camp.price_range?.amount_max >= 0 ? "Pay"
          : (camp.price_range?.amount_max === 0 ? "Free" : "Unknown"),
        src: "recgov",
        org: camp.org_name.includes("Bureau of Land Management") ? "BLM"
          : (camp.org_name.includes("USDA Forest Service") ? "USFS" : "Unknown"),
        ratings_count: camp.number_of_ratings,
        ratings_value: camp.average_rating * camp.number_of_ratings,
      }))
    } catch { }
  }

  if (src === "spots") {
    try {
      const resp = await fetch(uri + "&src=spots");
      const spotsJson = await resp.json();
      spotsJson.forEach((spot: Spot) => spots.push(spot))
    } catch { }
  }

  return spots;
};
