import { useState } from "react";
import { useMap } from 'react-leaflet';
import { LocateFixed } from "lucide-react";
import L from "leaflet";
import { Spot } from "@/lib/spots/types";
import SpotMarker from "./SpotMarker";

export default function MyLocation() {
  const map = useMap();
  const [position, setPosition] = useState<L.LatLngLiteral>();
  const spot: Spot = {
    _id: "MyLocation",
    name: "My Location",
    desc: "",
    type: "",
    lat: 0,
    lon: 0,
    org: "",
    fee: "",
    url: "",
    src: "",
    ratings_count: 0,
    ratings_value: 0,
  };

  function handleClick() {
    map.locate().on(
      "locationfound",
      e => {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      });
  }

  if (position) {
    spot.lat = position.lat;
    spot.lon = position.lng;
    spot.src = "MyLocation";
  }

  return (
    <>
      <LocateFixed
        className="absolute cursor-pointer bottom-10 right-10 z-[1000]"
        size={40}
        onClick={handleClick}
      />

      {spot.src.length > 0 && <SpotMarker spot={spot} />}
    </>
  )
}
