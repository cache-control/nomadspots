export interface FreeCampsite {
  "id": number;
  "type": string;
  "name": string;
  "latitude": number;
  "longitude": number;
  "distance": number;
  "url": string;
  "city": string;
  "county": string;
  "region": string;
  "country": string;
  "excerpt": string;
  "rating": string;
  "ratings_average": number;
  "ratings_count": number;
  "ratings_value": number;
  "type_specific": {
    "icon": string;
    "amenities": string;
    "activities": string;
    "fee": string;
  };
  "table_row": string;
};

export interface IOverlander {
  "guid": string;
  "name": string;
  "description": string;
  "date_verified": string;
  "amenities": {
    "Surroundings": string;
    "Spot Type": string;
    "Wifi": string;
    "Restaurant": string;
    "Showers": string;
    "Water": string;
    "Toilets": string;
    "Big Rig Friendly": string;
    "Tent Friendly": string;
    "Pet Friendly": string;
  };
  "category_icon_path": string;
  "category_icon_pin_path": string;
  "category_icon_pin_closed_path": string;
  "country": string;
  "category": string;
  "open": string;
  "location": {
    "latitude": number;
    "longitude": number;
    "altitude": number;
    "horizontal_accuracy": number;
    "vertical_accuracy": number;
  }
}

export interface RecreationGov {
  "accessible_campsites_count": number;
  "aggregate_cell_coverage": number;
  "average_rating": number;
  "campsite_accessible": number;
  "campsite_reserve_type": string[];
  "campsite_type_of_use": string[];
  "campsites_count": string;
  "city": string;
  "country_code": string;
  "description": string;
  "entity_id": string;
  "entity_type": string;
  "go_live_date": string;
  "id": string;
  "latitude": string;
  "longitude": string;
  "name": string;
  "number_of_ratings": number;
  "org_id": string;
  "org_name": string;
  "parent_id": string;
  "parent_name": string;
  "preview_image_url": string;
  "price_range": {
    "amount_max": number;
    "amount_min": number;
    "per_unit": string;
  };
  "reservable": boolean;
  "state_code": string;
  "type": string;
};

export interface Campendium {
  "id": number;
  "title": string;
  "city": string;
  "country": string;
  "latitude": number;
  "longitude": number;
  "slug": string;
  "booking_url": boolean;
  "place_id": string;
  "price": string;
  "is_extraordinary_place": boolean;
  "parking_color": string;
  "mapicon": string;
  "city_state": string;
  "state": string;
  "category_title": string;
  "sq_img": string;
  "stars": number;
  "reviews_count": number;
  "last_review_author": string;
  "last_review_title": string;
  "last_nightly_rate": number;
  "last_review_date": string;
  "sq_lead_photo_urls": string[];
  "published_photo_count": number;
  "booking_url_type": string;
}

export interface Dyrt {
  "id": string;
  "type": string;
  "links": {
    "self": string;
  };
  "attributes": {
    "accommodation-type-names": string[];
    "administrative-area": string;
    "availability": number;
    "availability-updated-at": string;
    "bookable": boolean;
    "booking-method": string;
    "camper-types": string[];
    "claimed": boolean;
    "eligible-for-scanning": boolean;
    "latitude": number;
    "longitude": number;
    "location-id": number;
    "location-type": string;
    "name": string;
    "nearest-city-name": string;
    "operator": string;
    "partner": string;
    "photo-url": string;
    "photo-urls": string[];
    "photos-count": number;
    "pin-type": string;
    "price-low-cents": number;
    "price-low-currency": string;
    "price-high-cents": number;
    "price-high-currency": string;
    "rating": number;
    "region-name": string;
    "reviews-count": number;
    "site-count": number;
    "slug": string;
    "user-listed": number;
    "videos-count": number;
    "price-high": string;
    "price-low": string;

  }
}

export interface Spot {
  _id: string;
  name: string;
  description: string;
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
