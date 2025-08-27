export interface FreeCampsite {
  id: number;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  url: string;
  city: string;
  county: string;
  region: string;
  country: string;
  excerpt: string;
  type_specific: {
    fee: string;
  },
  ratings_count: number;
  ratings_value: number;
};

export interface IOverlander {
  guid: string;
  name: string;
  description: string;
  date_verified: string;
  country: string;
  category: string;
  location: {
    latitude: number;
    longitude: number;
    altitude: number;
  }
};

export interface RecreationGov {
  accessible_campsites_count: number;
  aggregate_cell_coverage: number;
  average_rating: number;
  campsite_accessible: number;
  campsite_reserve_type: string[];
  campsite_type_of_use: string[];
  campsites_count: string;
  city: string;
  country_code: string;
  description: string;
  entity_id: string;
  entity_type: string;
  go_live_date: string;
  id: string;
  latitude: string;
  longitude: string;
  name: string;
  number_of_ratings: number;
  org_id: string;
  org_name: string;
  parent_id: string;
  parent_name: string;
  preview_image_url: string;
  price_range: {
    amount_max: number;
    amount_min: number;
    per_unit: string;
  },
  reservable: boolean;
  state_code: string;
  type: string;
};

export interface Spot {
  _id: string;
  name: string;
  desc: string;
  type: string;
  lat: number;
  lon: number;
  org: string;
  fee: string;
  url: string;
  src: string;
  ratings_count: number;
  ratings_value: number;
};

export interface SquareCorners {
  topLeft: {
    lat: number;
    lon: number;
  },
  topRight: {
    lat: number;
    lon: number;
  },
  bottomLeft: {
    lat: number;
    lon: number;
  },
  bottomRight: {
    lat: number;
    lon: number;
  }
};

export type IconColor = "blue" | "gold" | "red" | "green" | "orange" | "yellow" | "violet" | "grey" | "black";
