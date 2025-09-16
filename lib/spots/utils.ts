import { LngLat } from "maplibre-gl"
import type {
  FreeCampsite,
  IOverlander,
  RecreationGov,
  Campendium,
  Dyrt,
  OSM,
  Spot,
  SquareCorners
} from "@/lib/spots/types";

export type FetchSource = "fcs" | "iol" | "recgov" | "cpd" | "dyrt" | "osm" | "spots";

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

  if (src === "cpd") {
    try {
      const sq = getSquareCorners(pos.lat, pos.lng, 100);
      const url = "https://www.campendium.com/campgrounds/search.json"
        + "?filter_by_category_id%5B%5D=PL"
        + "&order_by=star_rating%2Creviews_count"
        + `&bounds=((${sq.bottomLeft.lat},+${sq.bottomLeft.lon}),+(${sq.topRight.lat},+${sq.topRight.lon}))`
        + "&zoom_level=5"
        + `&center_of_map=%7B%22lng%22%3A${pos.lng}%2C%22lat%22%3A${pos.lat}%7D`
        + "&price_range=0-0"
        + "&elevation_range=0-15124"
      const resp = await fetch(url);
      const json = await resp.json();

      json.results?.filter((camp: Campendium) => camp.reviews_count >= 3 && camp.stars >= 4)
      json.results?.sort((a: Campendium, b: Campendium) => b.reviews_count - a.reviews_count)
        .slice(0, 100)
        .forEach((camp: Campendium) => spots.push({
          _id: "cpd-" + camp.id,
          lat: camp.latitude,
          lon: camp.longitude,
          name: camp.title,
          description: camp.city_state,
          type: "campsite",
          url: "https://www.campendium.com/" + camp.slug,
          fee: (camp.price === "FREE") ? "Free" : "Unknown",
          src: "cpd",
          org: camp.category_title?.includes("National Forest") ? "USFS"
            : (camp.category_title?.includes("BLM") ? "BLM" : "Unknown"),
          ratings_count: camp.reviews_count,
          ratings_value: camp.reviews_count * camp.stars,
        }))
    } catch { }
  }

  if (src === "dyrt") {
    try {
      const sq = getSquareCorners(pos.lat, pos.lng, 100);
      const url = "https://thedyrt.com/api/v6/locations/search-results"
        + "?filter%5Bsearch%5D%5Bdrive_time%5D=any"
        + "&filter%5Bsearch%5D%5Bair_quality%5D=any"
        + "&filter%5Bsearch%5D%5Bcategories%5D=established%2Cdispersed"
        + "&filter%5Bsearch%5D%5Belectric_amperage%5D=any"
        + "&filter%5Bsearch%5D%5Bmax_vehicle_length%5D=any"
        + "&filter%5Bsearch%5D%5Bprice%5D=any"
        + "&filter%5Bsearch%5D%5Brating%5D=4"
        + `&filter%5Bsearch%5D%5Bbbox%5D=${sq.bottomLeft.lon}%2C${sq.bottomLeft.lat}%2C${sq.topRight.lon}%2C${sq.topRight.lat}`
        + "&sort=price-low-cents%2Cprice-high-cents"
        + "&page%5Bnumber%5D=1"
        + "&page%5Bsize%5D=500"
      const resp = await fetch(url);
      const json = await resp.json();

      json.data?.filter((camp: Dyrt) => camp.attributes["reviews-count"] >= 3)
        .slice(0, 100)
        .forEach((camp: Dyrt) => spots.push({
          _id: "dryt-" + camp.id,
          lat: camp.attributes.latitude,
          lon: camp.attributes.longitude,
          name: camp.attributes.name,
          description: camp.attributes["administrative-area"],
          type: "campsite",
          url: ["https://thedyrt.com/camping", camp.attributes["region-name"], camp.attributes.slug].join("/"),
          fee: (camp.attributes["price-high-cents"] === 0) ? "Free" : "Unknown",
          src: "dyrt",
          org: camp.attributes.operator?.includes("Forest Service") ? "USFS"
            : (camp.attributes.operator?.includes("BLM") ? "BLM" : "Unknown"),
          ratings_count: camp.attributes["reviews-count"],
          ratings_value: camp.attributes["reviews-count"] * camp.attributes.rating,
        }))
    } catch { }
  }

  if (src === "osm") {
    try {
      const sq = getSquareCorners(pos.lat, pos.lng, 100);
      const url = "https://opencampingmap.org/getcampsites";
      const formData = new FormData();
      formData.append("bbox", `${sq.bottomLeft.lon},${sq.bottomLeft.lat},${sq.topRight.lon},${sq.topRight.lat}`);
      const resp = await fetch(url, { method: 'POST', body: formData });
      const json = await resp.json();

      json.features?.filter((camp: OSM) => camp.properties.fee !== "yes" && camp.properties.tourism === "camp_site")
        .sort((a: OSM, b: OSM) => a.properties.fee?.localeCompare(b.properties.fee))
        .slice(0, 1000)
        .forEach((camp: OSM) => spots.push({
          _id: "osm-" + camp.id,
          lat: camp.geometry.coordinates[1],
          lon: camp.geometry.coordinates[0],
          name: camp.properties.name || "Unknown",
          description: camp.properties.description || camp.properties.operator,
          type: "campsite",
          url: camp.properties["contact:website"],
          fee: camp.properties.fee === "no" ? "Free"
            : (camp.properties.fee === "yes" ? "Pay" : "Unknown"),
          src: "osm",
          org: camp.properties.operator?.search(/Forest Service|USDA|USFS/) >= 0 ? "USFS"
            : (camp.properties.operator?.search(/BLM|Bureau of Land Management/) >= 0 ? "BLM" : "Unknown"),
          ratings_count: 0,
          ratings_value: 0,
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
