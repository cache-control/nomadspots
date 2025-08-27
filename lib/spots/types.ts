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
